import { t } from '@lingui/macro'
import {
  isEdgeNodeOfType,
  narrowEdgeNodeOfType,
  narrowNodeType,
} from '@moodlenet/common/dist/graphql/helpers'
import { ID } from '@moodlenet/common/dist/graphql/scalars.graphql'
import { AssetRefInput } from '@moodlenet/common/dist/graphql/types.graphql.gen'
import { fileExceedsMaxUploadSize } from '@moodlenet/common/dist/staticAsset/lib'
import { nodeGqlId2UrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { useFormik } from 'formik'
import { duration } from 'moment'
import { createElement, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router'
import { boolean, mixed, object, SchemaOf, string } from 'yup'
import { MNEnv, UNSPLASH_ENDPOINT } from '../../../../../constants'
import { useSeoContentId } from '../../../../../context/Global/Seo'
import { useSession } from '../../../../../context/Global/Session'
import {
  fullLocalEntityUrlByGqlId,
  getJustAssetRefUrl,
  getMaybeAssetRefUrl,
  useFiltered,
  useUploadTempFile,
} from '../../../../../helpers/data'
import {
  getOriginalCreationTimestampByStrings,
  useIscedFields,
  useIscedGrades,
  useLanguages,
  useLicenses,
  useResourceTypes,
} from '../../../../../helpers/resource-relation-data-static-and-utils'
import { useAutoImageAdded } from '../../../../../helpers/utilities'
import { useLMS } from '../../../../../lib/moodleLMS/useSendToMoodle'
import { href } from '../../../../elements/link'
// import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { fallbackProps } from '../../Extra/Fallback/Ctrl/FallbackCtrl'
import { Fallback } from '../../Extra/Fallback/Fallback'
import { useCreateResourceRelationMutation } from '../../NewResource/Ctrl/NewResourceCtrl.gen'
// import { useFormikBag } from '../../../lib/formik'
// import { NewResourceFormValues } from '../../NewResource/types'
import { ResourceFormValues, ResourceProps } from '../Resource'
import {
  useDelResourceMutation,
  useDelResourceRelationMutation,
  useEditResourceMutation,
  useResourcePageDataQuery,
} from './ResourcePage.gen'

export const lmsValidationSchema: SchemaOf<{ site?: string }> = object({
  site: string().url().required(),
})
export const validationSchema: SchemaOf<ResourceFormValues> = object({
  category: string().required(t`Please select a subject`),
  license: string().when('isFile', (isFile, schema) => {
    return isFile ? schema.required(t`Select a license`) : schema.optional()
  }),
  isFile: boolean().required(),
  description: string()
    .min(3)
    .max(4096)
    .required(t`Please provide a description`),
  name: string()
    .min(3)
    .max(160)
    .required(t`Please provide a title`),
  image: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && fileExceedsMaxUploadSize(v.size, MNEnv.maxUploadSize)
        ? createError({
            message: t`The file is too big, reduce the size or provide a url`,
          })
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
export type ResourceCtrlProps = { id: ID }
export const useResourceCtrl: CtrlHook<ResourceProps, ResourceCtrlProps> = ({
  id,
}) => {
  useSeoContentId(id)
  const { session, isAdmin, isAuthenticated, reportEntity } = useSession()
  const autoImageAdded = useAutoImageAdded().get()

  const allMyOwnCollectionEdges = useMemo(
    () =>
      session?.profile.myOwnCollections.edges.filter(
        isEdgeNodeOfType(['Collection'])
      ) ?? [],
    [session?.profile.myOwnCollections.edges]
  )
  // console.log({ allMyOwnCollectionEdges })
  // const { org: localOrg } = useLocalInstance()
  const { data, refetch, loading } = useResourcePageDataQuery({
    variables: {
      resourceId: id,
      myProfileId: session ? [session.profile.id] : [],
      myCollectionsIds: allMyOwnCollectionEdges.map((_) => _.node.id),
    },
    fetchPolicy: 'cache-and-network',
  })
  const resourceData = narrowNodeType(['Resource'])(data?.node)
  const history = useHistory()
  const [delResource, delResourceRes] = useDelResourceMutation()
  const myId = session?.profile.id
  const deleteResourceForm = useFormik({
    initialValues: {},
    async onSubmit() {
      if (!myId || delResourceRes.loading) {
        return
      }
      delResource({ variables: { node: { id, nodeType: 'Resource' } } }).then(
        () => {
          history.replace(nodeGqlId2UrlPath(myId))
        }
      )
    },
  })

  const [addRelation, addRelationRes] = useCreateResourceRelationMutation()
  const [delRelation, delRelationRes] = useDelResourceRelationMutation()
  const [edit, editRes] = useEditResourceMutation()
  const categoryEdge = narrowEdgeNodeOfType(['IscedField'])(
    resourceData?.categories.edges[0]
  )
  const levelEdge = resourceData?.grades.edges.filter(
    isEdgeNodeOfType(['IscedGrade'])
  )[0]

  const typeEdge = resourceData?.types.edges.filter(
    isEdgeNodeOfType(['ResourceType'])
  )[0]

  const languageEdge = resourceData?.languages.edges.filter(
    isEdgeNodeOfType(['Language'])
  )[0]

  const licenseEdge = resourceData?.licenses.edges.filter(
    isEdgeNodeOfType(['License'])
  )[0]

  const uploadTempFile = useUploadTempFile()
  const form = useFormik<ResourceFormValues>({
    validationSchema,
    initialValues: {} as any,
    onSubmit: async ({
      category,
      description,
      image,
      language,
      level,
      license,
      month,
      name,
      type,
      visibility,
      year,
    }) => {
      if (
        !form.dirty ||
        addRelationRes.loading ||
        delRelationRes.loading ||
        editRes.loading
      ) {
        return
      }
      const imageAssetRef: AssetRefInput = !image
        ? {
            location: '',
            type: 'NoAsset',
            credits: form.initialValues.image?.credits,
          }
        : image.location === form.initialValues.image?.location
        ? {
            location: '',
            type: 'NoChange',
            credits: form.initialValues.image?.credits,
          }
        : typeof image.location === 'string'
        ? {
            location: image.location,
            type: 'ExternalUrl',
            credits: image.credits,
          }
        : image.location instanceof File
        ? {
            location: await uploadTempFile('image', image.location),
            type: 'TmpUpload',
            credits: image.credits,
          }
        : {
            location: '',
            type: 'NoChange',
            credits: form.initialValues.image?.credits,
          }
      const editResPr = edit({
        variables: {
          id,
          resInput: {
            description,
            name,
            originalCreationDate: getOriginalCreationTimestampByStrings({
              month,
              year,
            }),
            image: imageAssetRef,
            _published: visibility === 'Public',
          },
        },
      })
      const editLangRelPr = (() => {
        if (form.initialValues.language === language) {
          return
        }
        return Promise.all([
          languageEdge &&
            delRelation({ variables: { edge: { id: languageEdge.edge.id } } }),
          language &&
            addRelation({
              variables: {
                edge: {
                  edgeType: 'Features',
                  from: id,
                  to: language,
                  Features: {},
                },
              },
            }),
        ])
      })()

      const editLicenseRelPr = (() => {
        if (form.initialValues.license === license) {
          return
        }
        return Promise.all([
          licenseEdge &&
            delRelation({ variables: { edge: { id: licenseEdge.edge.id } } }),
          license &&
            addRelation({
              variables: {
                edge: {
                  edgeType: 'Features',
                  from: id,
                  to: license,
                  Features: {},
                },
              },
            }),
        ])
      })()

      const editTypeRelPr = (() => {
        if (form.initialValues.type === type) {
          return
        }
        return Promise.all([
          typeEdge &&
            delRelation({ variables: { edge: { id: typeEdge.edge.id } } }),
          type &&
            addRelation({
              variables: {
                edge: {
                  edgeType: 'Features',
                  from: id,
                  to: type,
                  Features: {},
                },
              },
            }),
        ])
      })()

      const editGradeRelPr = (() => {
        if (form.initialValues.level === level) {
          return
        }
        return Promise.all([
          levelEdge &&
            delRelation({ variables: { edge: { id: levelEdge.edge.id } } }),
          level &&
            addRelation({
              variables: {
                edge: {
                  edgeType: 'Features',
                  from: id,
                  to: level,
                  Features: {},
                },
              },
            }),
        ])
      })()

      const editIscedFRelPr = (() => {
        if (form.initialValues.category === category) {
          return
        }
        return Promise.all([
          categoryEdge &&
            delRelation({ variables: { edge: { id: categoryEdge.edge.id } } }),
          category &&
            addRelation({
              variables: {
                edge: {
                  edgeType: 'Features',
                  from: id,
                  to: category,
                  Features: {},
                },
              },
            }),
        ])
      })()

      await Promise.all([
        editResPr,
        editLangRelPr,
        editLicenseRelPr,
        editTypeRelPr,
        editGradeRelPr,
        editIscedFRelPr,
      ])
      return refetch()
    },
  })

  const _resetform = form.resetForm
  useEffect(() => {
    if (resourceData) {
      const category = categoryEdge?.node.id!
      const level = levelEdge?.node.id
      const type = typeEdge?.node.id
      const language = languageEdge?.node.id
      const license = licenseEdge?.node.id
      const {
        name,
        description,
        image,
        _published,
        content: { ext },
      } = resourceData
      const orgDate =
        typeof resourceData.originalCreationDate === 'number'
          ? new Date(resourceData.originalCreationDate)
          : null
      const _image = getMaybeAssetRefUrl(image)
      _resetform({
        touched: {},
        values: {
          isFile: !ext,
          category,
          language,
          level,
          license,
          type,
          description,
          image: _image
            ? { location: _image, credits: image?.credits }
            : undefined,
          name,
          visibility: _published ? 'Public' : 'Private',
          month: orgDate ? `${orgDate.getMonth()}` : undefined,
          year: orgDate ? `${orgDate.getFullYear()}` : undefined,
        },
      })
    }
  }, [
    _resetform,
    categoryEdge?.node.id,
    languageEdge?.node.id,
    levelEdge?.node.id,
    licenseEdge?.node.id,
    resourceData,
    typeEdge?.node.id,
  ])

  const creatorEdge = narrowEdgeNodeOfType(['Profile', 'Organization'])(
    resourceData?.creator.edges[0]
  )

  const creator = creatorEdge?.node

  const isOwner = creator && session ? creator.id === session.profile.id : false

  const myBookmarkedEdgeId = resourceData?.myBookmarked.edges[0]?.edge.id
  const toggleBookmarkForm = useFormik({
    initialValues: {},
    async onSubmit() {
      if (!session || addRelationRes.loading || delRelationRes.loading) {
        return
      }
      if (myBookmarkedEdgeId) {
        return delRelation({
          variables: { edge: { id: myBookmarkedEdgeId } },
        }).then(() => refetch())
      } else {
        return addRelation({
          variables: {
            edge: {
              edgeType: 'Bookmarked',
              from: session.profile.id,
              to: id,
              Bookmarked: {},
            },
          },
        }).then(() => refetch())
      }
    },
  })

  const likedEdge = resourceData?.myLike.edges[0]
  const liked = !!likedEdge
  const toggleLikeForm = useFormik({
    initialValues: {},
    async onSubmit() {
      if (!session || addRelationRes.loading || delRelationRes.loading) {
        return
      }
      if (likedEdge) {
        await delRelation({ variables: { edge: { id: likedEdge.edge.id } } })
      } else {
        await addRelation({
          variables: {
            edge: {
              edgeType: 'Likes',
              from: session.profile.id,
              to: id,
              Likes: {},
            },
          },
        })
      }
      refetch()
    },
  })

  const { sendToLMS, currentLMSPrefs } = useLMS(
    resourceData
      ? {
          asset: resourceData.content,
          resource: resourceData,
          license: licenseEdge?.node,
        }
      : null
  )

  const inMyCollectionsEdges = useMemo(
    () =>
      resourceData?.inMyCollections.edges.filter(
        isEdgeNodeOfType(['Collection'])
      ) ?? [],
    [resourceData?.inMyCollections.edges]
  )

  const addToCollectionsForm = useFormik<{ collections: string[] }>({
    initialValues: {
      collections: [],
    },
    onSubmit() {},
    async validate({ collections: curr }) {
      const prev = addToCollectionsForm.values.collections
      const toAdd = curr.filter((_) => !prev.includes(_))
      const toRemove = prev.filter((_) => !curr.includes(_))
      const toRemoveEdges = inMyCollectionsEdges.filter(({ node: { id } }) =>
        toRemove.includes(id)
      )
      const promises = [
        ...toAdd.map((toAddId) =>
          addRelation({
            variables: {
              edge: {
                edgeType: 'Features',
                from: toAddId,
                to: id,
                Features: {},
              },
            },
          })
        ),
        ...toRemoveEdges.map(({ edge: { id } }) =>
          delRelation({
            variables: { edge: { id } },
          })
        ),
      ]
      await Promise.all<any>(promises)
      refetch()
    },
  })
  const _resetAddToCollectionsForm = addToCollectionsForm.resetForm
  useEffect(() => {
    _resetAddToCollectionsForm({
      touched: {},
      values: {
        collections: inMyCollectionsEdges.map(({ node: { id } }) => id),
      },
    })
  }, [_resetAddToCollectionsForm, inMyCollectionsEdges])

  const sendToMoodleLmsForm = useFormik<{ site?: string }>({
    initialValues: { site: currentLMSPrefs?.site },
    validationSchema: lmsValidationSchema,
    onSubmit: async ({ site }, { setErrors }) => {
      const r = await sendToLMS(site)
      if (!r) {
        setErrors({ site: t`Couldn't send to your MoodleLMS` })
      }
    },
  })

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
  const resourceUrl = fullLocalEntityUrlByGqlId(id)

  const reportForm = useFormik({
    initialValues: { comment: '' },
    validationSchema: object({ comment: string().required(t`Required field`) }),
    validateOnMount: true,
    onSubmit: async ({ comment }) => {
      await reportEntity({
        comment,
        entityUrl: resourceUrl,
      })
    },
  })
  const resourceProps = useMemo<null | ResourceProps>(() => {
    if (!resourceData) {
      return null
    }
    const _ext = resourceData.content.location
      .split('.')
      .reverse()[0]
      ?.toLowerCase()

    const type = resourceData.kind === 'Link' ? 'Web Page' : _ext ?? 'file'

    const downloadFilename = _ext
      ? `${resourceData.name}.${_ext}`
      : resourceData.name

    const props: ResourceProps = {
      resourceUrl,
      downloadFilename,
      type,
      resourceId: resourceData.id,
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}, id),
      canSearchImage: !!UNSPLASH_ENDPOINT,
      form,
      isOwner,
      isAdmin,
      liked,
      reportForm,
      autoImageAdded,
      contributorCardProps: {
        avatarUrl: getMaybeAssetRefUrl(
          creator?.__typename === 'Profile'
            ? creator.avatar
            : creator?.smallLogo
        ),
        creatorProfileHref: href(creator ? nodeGqlId2UrlPath(creator.id) : ''),
        displayName: creator?.name ?? '',
        timeSinceCreation: creatorEdge
          ? duration(
              creatorEdge.edge._created - new Date().valueOf(),
              'milliseconds'
            ).humanize(true)
          : '?',
      },
      isAuthenticated,
      tags: resourceData.categories.edges
        .filter(isEdgeNodeOfType(['IscedField']))
        .map(({ node }) => ({
          name: node.name,
          type: 'subject',
          subjectHomeHref: href(nodeGqlId2UrlPath(node.id)),
        })),
      collections: {
        opts: allMyOwnCollectionEdges.map(({ node: { id, name } }) => ({
          value: id,
          label: name,
        })),
        selected: resourceData.inMyCollections.edges
          .filter(isEdgeNodeOfType(['Collection']))
          .map(({ node: { name: label, id: value } }) => ({ label, value })),
      },
      setLanguageFilter,
      languages: {
        opts: filteredLanguages.map(({ name, id }) => ({
          value: id,
          label: name,
        })),
        selected: languages
          .filter((node) => node.id === form.values.language)
          .map(({ name, id }) => ({ value: id, label: name }))[0],
      },
      setLevelFilter,
      levels: {
        opts: filteredIscedGrades.map(({ name, id }) => ({
          value: id,
          label: name,
        })),
        selected: iscedGrades
          .filter((node) => node.id === form.values.level)
          .map(({ name, id }) => ({ value: id, label: name }))[0],
      },
      setTypeFilter,
      types: {
        opts: fliteredResourceTypes.map(({ name, id }) => ({
          value: id,
          label: name,
        })),
        selected: resourceTypes
          .filter((node) => node.id === form.values.type)
          .map(({ name, id }) => ({ value: id, label: name }))[0],
      },
      setCategoryFilter,
      categories: {
        opts: fliteredIscedFields.map(({ name, id }) => ({
          value: id,
          label: name,
        })),
        selected: iscedFields
          .filter((node) => node.id === form.values.category)
          .map(({ name, id }) => ({ value: id, label: name }))[0],
      },
      licenses: {
        opts: licenses.map(([{ name, id }, icon]) => ({
          value: id,
          label: name,
          icon,
        })),
        selected: licenses
          .filter(([node]) => node.id === form.values.license)
          .map(([{ name, id }, icon]) => ({ value: id, label: name, icon }))[0],
      },
      toggleLikeForm: toggleLikeForm,
      bookmarked: !!myBookmarkedEdgeId,
      numLikes: resourceData.likesCount,
      toggleBookmarkForm: toggleBookmarkForm,
      deleteResourceForm: isOwner || isAdmin ? deleteResourceForm : undefined,
      sendToMoodleLmsForm: sendToMoodleLmsForm,
      contentUrl: getJustAssetRefUrl(resourceData.content),
      addToCollectionsForm,
      contentType: resourceData.content.ext ? 'link' : 'file',
      resourceFormat: resourceData.content.mimetype.replace('application/', ''),
    }
    return props
  }, [
    resourceData,
    resourceUrl,
    id,
    form,
    isOwner,
    isAdmin,
    liked,
    reportForm,
    autoImageAdded,
    creator,
    creatorEdge,
    isAuthenticated,
    allMyOwnCollectionEdges,
    setLanguageFilter,
    filteredLanguages,
    languages,
    setLevelFilter,
    filteredIscedGrades,
    iscedGrades,
    setTypeFilter,
    fliteredResourceTypes,
    resourceTypes,
    setCategoryFilter,
    fliteredIscedFields,
    iscedFields,
    licenses,
    toggleLikeForm,
    myBookmarkedEdgeId,
    toggleBookmarkForm,
    deleteResourceForm,
    sendToMoodleLmsForm,
    addToCollectionsForm,
  ])
  if (!loading && !data?.node) {
    return createElement(Fallback, fallbackProps({ key: 'resource-not-found' }))
  }
  return resourceProps && [resourceProps]
}
