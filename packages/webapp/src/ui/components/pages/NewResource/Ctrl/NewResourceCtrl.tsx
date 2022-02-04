import { t } from '@lingui/macro'
import {
  isEdgeNodeOfType,
  isOfNodeType,
} from '@moodlenet/common/dist/graphql/helpers'
import { AssetRefInput } from '@moodlenet/common/dist/graphql/types.graphql.gen'
import { fileExceedsMaxUploadSize } from '@moodlenet/common/dist/staticAsset/lib'
import { urlRegex } from '@moodlenet/common/dist/utils/general'
import { nodeGqlId2UrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { useFormik } from 'formik'
import { useEffect, useMemo } from 'react'
import { useHistory } from 'react-router'
import { array, mixed, object, SchemaOf, string } from 'yup'
import { MNEnv } from '../../../../../constants'
import { useSession } from '../../../../../context/Global/Session'
import { useFiltered, useUploadTempFile } from '../../../../../helpers/data'
import {
  getOriginalCreationTimestampByStrings,
  useIscedFields,
  useIscedGrades,
  useLanguages,
  useLicenses,
  useResourceTypes,
} from '../../../../../helpers/resource-relation-data-static-and-utils'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { NewResourceProps } from '../NewResource'
import { NewResourceFormValues } from '../types'
import {
  useCreateResourceMutation,
  useCreateResourceRelationMutation,
  useNewResourceDataPageLazyQuery,
} from './NewResourceCtrl.gen'
const validationSchema: SchemaOf<NewResourceFormValues> = object({
  category: string().required(t`Please select a subject`),
  license: string().when('content', (content, schema) => {
    return content instanceof Blob
      ? schema.required(t`Select a License`)
      : schema.optional()
  }),
  content: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && fileExceedsMaxUploadSize(v.size, MNEnv.maxUploadSize)
        ? createError({ message: t`This file is too big for uploading` })
        : 'string' === typeof v && !urlRegex.test(v)
        ? createError({ message: t`Please provide a proper url` })
        : true
    )
    .required(t`Please provide a content`),
  description: string()
    .max(4096)
    .min(3)
    .required(t`Please provide a description`),
  name: string()
    .min(3)
    .max(160)
    .required(t`Please provide a title`),
  addToCollections: array().of(string()).optional(),
  image: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && fileExceedsMaxUploadSize(v.size, MNEnv.maxUploadSize)
        ? createError({ message: t`This file is too big for uploading` })
        : true
    )
    .optional(),
  language: string().optional(),
  level: string().optional(),
  month: string().optional(),
  type: string().optional(),
  visibility: mixed().required(t`Visibility is required`),
  year: string().when('month', (month, schema) => {
    return month ? schema.required(t`Please select a year`) : schema.optional()
  }),
})
export type NewResourceCtrlProps = {}

export const useNewResourceCtrl: CtrlHook<
  NewResourceProps,
  NewResourceCtrlProps
> = () => {
  const { session } = useSession()
  const history = useHistory()
  const [fliteredIscedFields, setCategoryFilter, iscedFields] = useFiltered(
    useIscedFields(),
    'id;name'
  )

  const [filteredIscedGrades, setLevelFilter, iscedGrades] = useFiltered(
    useIscedGrades(),
    'id;name'
  )

  const [filteredLanguages, setLanguageFilter, languages] = useFiltered(
    useLanguages(),
    'id;name'
  )

  const [fliteredResourceTypes, setTypeFilter, resourceTypes] = useFiltered(
    useResourceTypes(),
    'id;name'
  )

  const licenses = useLicenses()

  const myId = session?.profile.id
  const [loadMyColl, mycollectionsQRes] = useNewResourceDataPageLazyQuery({
    fetchPolicy: 'cache-and-network',
  })
  const uploadTempFile = useUploadTempFile()
  const [createResourceMut, createResourceMutRes] = useCreateResourceMutation()
  const [createResourceRelMut, addRelationRes] =
    useCreateResourceRelationMutation()

  const myCollections = useMemo(
    () =>
      mycollectionsQRes.data?.node?.myCollections.edges
        .filter(isEdgeNodeOfType(['Collection']))
        .map(({ node }) => node) ?? [],
    [mycollectionsQRes]
  )

  useEffect(() => {
    if (myId) {
      loadMyColl({ variables: { myId } })
    }
  }, [myId, loadMyColl])

  const form = useFormik<NewResourceFormValues>({
    validationSchema,
    initialValues: {
      addToCollections: [],
      category: '',
      content: '',
      description: '',
      name: '',
      visibility: 'Private',
    },
    onSubmit: async ({
      content,
      category,
      image,
      description,
      visibility,
      level,
      language,
      license,
      type,
      addToCollections,
      name,
      month,
      year,
    }) => {
      if (addRelationRes.loading || createResourceMutRes.loading) {
        return
      }
      const contentAssetRef: AssetRefInput =
        typeof content === 'string'
          ? {
              location: content,
              type: 'ExternalUrl',
            }
          : {
              location: await uploadTempFile('resource', content),
              type: 'TmpUpload',
            }

      const imageAssetRef: AssetRefInput = !image
        ? { location: '', type: 'NoAsset' }
        : typeof image === 'string'
        ? {
            location: image,
            type: 'ExternalUrl',
          }
        : {
            location: await uploadTempFile('image', image),
            type: 'TmpUpload',
          }

      const resourceCreationResp = await createResourceMut({
        variables: {
          res: {
            nodeType: 'Resource',
            Resource: {
              content: contentAssetRef,
              description,
              _published: visibility === 'Public',
              name,
              image: imageAssetRef,
              originalCreationDate: getOriginalCreationTimestampByStrings({
                month,
                year,
              }),
            },
          },
        },
      })
      const createRespData = resourceCreationResp.data?.resource
      if (
        !(
          createRespData?.__typename === 'CreateNodeMutationSuccess' &&
          isOfNodeType(['Resource'])(createRespData.node)
        )
      ) {
        const err =
          (createRespData?.__typename === 'CreateNodeMutationError' &&
            createRespData.details) ||
          'Unexpected error whlie creating Resource'
        form.setErrors({ content: err })
        return
      }

      const {
        node: { id: resId },
      } = createRespData
      const waitFor: Promise<any>[] = []

      waitFor.push(
        createResourceRelMut({
          variables: {
            edge: {
              edgeType: 'Features',
              from: resId,
              to: category,
              Features: {},
            },
          },
        })
      )

      if (language) {
        waitFor.push(
          createResourceRelMut({
            variables: {
              edge: {
                edgeType: 'Features',
                from: resId,
                to: language,
                Features: {},
              },
            },
          })
        )
      }

      if (license) {
        waitFor.push(
          createResourceRelMut({
            variables: {
              edge: {
                edgeType: 'Features',
                from: resId,
                to: license,
                Features: {},
              },
            },
          })
        )
      }

      if (type) {
        waitFor.push(
          createResourceRelMut({
            variables: {
              edge: {
                edgeType: 'Features',
                from: resId,
                to: type,
                Features: {},
              },
            },
          })
        )
      }

      if (level) {
        waitFor.push(
          createResourceRelMut({
            variables: {
              edge: {
                edgeType: 'Features',
                from: resId,
                to: level,
                Features: {},
              },
            },
          })
        )
      }

      waitFor.push(
        ...addToCollections.map(async (collectionId) => {
          return createResourceRelMut({
            variables: {
              edge: {
                edgeType: 'Features',
                to: resId,
                from: collectionId,
                Features: {},
              },
            },
          })
        })
      )
      await Promise.all(waitFor)

      history.push(nodeGqlId2UrlPath(resId))
    },
  })
  const newResourceProps = useMemo<NewResourceProps>(() => {
    const props: NewResourceProps = {
      headerPageTemplateProps: ctrlHook(
        useHeaderPageTemplateCtrl,
        {},
        'header-page-template'
      ),
      addToCollectionsProps: {
        collections: {
          opts: myCollections.map(({ id: value, name: label }) => ({
            label,
            value,
          })),
          selected: myCollections
            .filter(({ id }) => form.values.addToCollections.includes(id))
            .map(({ id: value, name: label }) => ({ label, value })),
        },
      },
      extraDetailsProps: {
        setLanguageFilter,
        languages: {
          opts: filteredLanguages.map(({ id: value, name: label }) => ({
            label,
            value,
          })),
          selected: languages
            .filter(({ id }) => form.values.language === id)
            .map(({ id: value, name: label }) => ({ label, value }))[0],
        },
        setLevelFilter,
        levels: {
          opts: filteredIscedGrades.map(({ id: value, name: label }) => ({
            label,
            value,
          })),
          selected: iscedGrades
            .filter(({ id }) => form.values.level === id)
            .map(({ id: value, name: label }) => ({ label, value }))[0],
        },
        setTypeFilter,
        types: {
          opts: fliteredResourceTypes.map(({ id: value, name: label }) => ({
            label,
            value,
          })),
          selected: resourceTypes
            .filter(({ id }) => form.values.type === id)
            .map(({ id: value, name: label }) => ({ label, value }))[0],
        },
      },
      uploadResourceProps: {
        fileMaxSize: MNEnv.maxUploadSize,

        setCategoryFilter,
        categories: {
          opts: fliteredIscedFields.map(({ id: value, name: label }) => ({
            label,
            value,
          })),
          selected: iscedFields
            .filter(({ id }) => form.values.category === id)
            .map(({ id: value, name: label }) => ({ label, value }))[0],
        },

        licenses: {
          opts: licenses.map(([{ id: value, name: label }, icon]) => ({
            label,
            value,
            icon,
          })),
          selected: licenses
            .filter(([{ id }]) => form.values.license === id)
            .map(([{ id: value, name: label }, icon]) => ({
              label,
              value,
              icon,
            }))[0],
        },
      },
      form,
    }
    return props
  }, [
    filteredIscedGrades,
    filteredLanguages,
    fliteredIscedFields,
    fliteredResourceTypes,
    form,
    iscedFields,
    iscedGrades,
    languages,
    licenses,
    myCollections,
    resourceTypes,
    setCategoryFilter,
    setLanguageFilter,
    setLevelFilter,
    setTypeFilter,
  ])
  return newResourceProps && [newResourceProps]
}

export const canLoadUrlToImgTag = (url: string, timeoutT?: number) => {
  return new Promise(function (resolve, reject) {
    const timeout = timeoutT || 5000
    const img = new Image()

    img.onerror = img.onabort = () => {
      clearTimeout()
      reject('error')
    }

    img.onload = () => {
      clearTimeout()
      resolve('success')
    }

    setTimeout(() => {
      // reset .src to invalid URL so it stops previous
      // loading, but doesn't trigger new load
      img.src = '//!!!!/test.jpg'
      reject('timeout')
    }, timeout)

    img.src = url
  })
}

export const urlMatchesImage = (url: string): boolean => {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null
}
