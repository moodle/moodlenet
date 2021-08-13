import { AssetRefInput } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { DistOmit } from '@moodlenet/common/lib/utils/types'
import { nodeGqlId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { Reducer, useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { useHistory } from 'react-router'
import { useSession } from '../../../../context/Global/Session'
import { useUploadTempFile } from '../../../../helpers/data'
import {
  categoriesOptions,
  getGrade,
  getIscedF,
  getLang,
  getLicense,
  getOriginalCreationTimestampByStrings,
  getType,
  langOptions,
  licensesOptions,
  monthOptions,
  resGradeOptions,
  resTypeOptions,
  yearsOptions,
} from '../../../../helpers/resource-relation-data-static-and-utils'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useFormikBag } from '../../../lib/formik'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { NewResourceProps } from '../NewResource'
import { NewResourceFormValues } from '../types'
import { UploadResourceProps } from '../UploadResource/UploadResource'
import {
  useCreateResourceMutation,
  useCreateResourceRelationMutation,
  useNewResourceDataPageLazyQuery,
} from './NewResourceCtrl.gen'

const initialSetStepProps: DistOmit<UploadResourceProps, 'formBag' | 'deleteContent' | 'nextStep'> = {
  step: 'UploadResourceStep',
  state: 'ChooseResource',
  imageUrl: '',
  categories: categoriesOptions,
  licenses: licensesOptions,
}

export type NewResourceCtrlProps = {}

export const useNewResourceCtrl: CtrlHook<NewResourceProps, NewResourceCtrlProps> = () => {
  const { session } = useSession()
  const history = useHistory()
  const myId = session?.profile.id
  const [loadMyColl, mycollectionsQRes] = useNewResourceDataPageLazyQuery()
  const uploadTempFile = useUploadTempFile()
  const [createResourceMut /* , createResourceMutRes */] = useCreateResourceMutation()
  const [createResourceRelMut /* , createResourceRelMutRes */] = useCreateResourceRelationMutation()

  const mycollections = useMemo(() => mycollectionsQRes.data?.node?.myCollections.edges.map(_ => _.node) ?? [], [
    mycollectionsQRes.data?.node?.myCollections,
  ])

  useEffect(() => {
    if (myId) {
      loadMyColl({ variables: { myId } })
    }
  }, [myId, loadMyColl])
  const [form, formBag] = useFormikBag<NewResourceFormValues>({
    initialValues: {
      addToCollections: [],
      category: '',
      content: '',
      description: '',
      format: null,
      image: null,
      language: null,
      level: null,
      license: null,
      name: '',
      originalDateMonth: null,
      originalDateYear: null,
      title: '',
      contentType: 'Link',
      type: null,
    },
    onSubmit: console.log.bind(console, 'submit newResource'),
  })

  const [sform] = formBag
  const sformSetField = sform.setFieldValue

  const deleteContent = useCallback(() => {
    sformSetField('image', '')
    sformSetField('content', '')
  }, [sformSetField])

  type StepProps = DistOmit<NewResourceProps['stepProps'], 'nextStep'>
  type StepPropsHistoryItem = [curr: StepProps, prev: StepPropsHistoryItem | null]
  const [[stepProps, prevStepProps], setNextStepProps] = useReducer<Reducer<StepPropsHistoryItem, StepProps | 'back'>>(
    ([curr, prev], next) => {
      if (next === 'back') {
        return prev ?? [curr, prev]
      }
      return [next, [curr, prev]]
    },
    [
      {
        ...initialSetStepProps,
        formBag,
        deleteContent,
      },
      null,
    ],
  )
  const { content, name, image } = sform.values

  const [imageUrl, setImageUrl] = useState('')
  useEffect(() => {
    const imageObjectUrl = image instanceof File ? URL.createObjectURL(image) : ''
    setImageUrl(imageObjectUrl)
    return () => URL.revokeObjectURL(imageObjectUrl)
  }, [image, setImageUrl])

  useEffect(() => {
    if (!sform.values.content && prevStepProps) {
      setNextStepProps('back')
    }
  }, [sform.values.content, prevStepProps])

  const previousStep = useCallback(() => setNextStepProps('back'), [setNextStepProps])

  const nextStep = useMemo(() => {
    // console.log('nextStep', { deleteContent, formBag, previousStep, sform, stepProps, formValues: form.values })
    if (stepProps.step === 'UploadResourceStep') {
      if (stepProps.state === 'ChooseResource') {
        if (form.values.content) {
          return () => {
            if (form.values.content instanceof File && form.values.content.type.toLowerCase().startsWith('image')) {
              sformSetField('image', form.values.content)
            }
            setNextStepProps({
              ...initialSetStepProps,
              step: 'UploadResourceStep',
              state: 'EditData',
              deleteContent,
              formBag,
              imageUrl,
            })
          }
          //   categories,
        }
      } else if (stepProps.state === 'EditData') {
        if (form.values.title && form.values.description && form.values.category && form.values.license) {
          return () => {
            setNextStepProps({
              step: 'AddToCollectionsStep',
              collections: mycollections.map(_ => _.name),
              previousStep,
              setAddToCollections: collections => sformSetField('addToCollections', collections),
            })
          }
        }
      }
    } else if (stepProps.step === 'AddToCollectionsStep') {
      return () => {
        setNextStepProps({
          step: 'ExtraDetailsStep',
          // formats: resFormatOptions,
          languages: langOptions,
          levels: resGradeOptions,
          types: resTypeOptions,
          months: monthOptions,
          years: yearsOptions,
          previousStep,
          formBag,
        })
      }
    } else if (stepProps.step === 'ExtraDetailsStep') {
      return async () => {
        const {
          content,
          category,
          image,
          title,
          description,
          level,
          language,
          license,
          type,
          addToCollections,
          originalDateMonth,
          originalDateYear,
        } = form.values
        if (!content) {
          return previousStep()
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
                name: title,
                image: imageAssetRef,
                originalCreationDate: getOriginalCreationTimestampByStrings({ originalDateMonth, originalDateYear }),
              },
            },
          },
        })
        const resource = resourceCreationResp.data?.resource
        if (resource?.__typename === 'CreateNodeMutationSuccess' && resource.node.__typename === 'Resource') {
          const resId = resource.node.id

          const waitFor: Promise<any>[] = []

          const { iscedFId } = getIscedF(category)
          waitFor.push(
            createResourceRelMut({
              variables: { edge: { edgeType: 'Features', from: resId, to: iscedFId, Features: {} } },
            }),
          )

          if (language) {
            const { langId } = getLang(language)
            waitFor.push(
              createResourceRelMut({
                variables: { edge: { edgeType: 'Features', from: resId, to: langId, Features: {} } },
              }),
            )
          }

          if (license) {
            const { licenseId } = getLicense(license)
            waitFor.push(
              createResourceRelMut({
                variables: { edge: { edgeType: 'Features', from: resId, to: licenseId, Features: {} } },
              }),
            )
          }

          if (type) {
            const { typeId } = getType(type)
            waitFor.push(
              createResourceRelMut({
                variables: { edge: { edgeType: 'Features', from: resId, to: typeId, Features: {} } },
              }),
            )
          }

          if (level) {
            const { gradeId } = getGrade(level)
            waitFor.push(
              createResourceRelMut({
                variables: { edge: { edgeType: 'Features', from: resId, to: gradeId, Features: {} } },
              }),
            )
          }

          waitFor.push(
            ...addToCollections.map(async collName => {
              const collectionId = mycollections.find(_ => _.name === collName)!.id
              return createResourceRelMut({
                variables: { edge: { edgeType: 'Features', to: resId, from: collectionId, Features: {} } },
              })
            }),
          )
          await Promise.all(waitFor)

          history.push(nodeGqlId2UrlPath(resId))
        }
      }
    }
    return undefined
  }, [
    history,
    createResourceRelMut,
    deleteContent,
    createResourceMut,
    uploadTempFile,
    formBag,
    previousStep,
    sformSetField,
    stepProps,
    form.values,
    mycollections,
    imageUrl,
  ])

  useEffect(() => {
    if (content) {
      if (content instanceof File) {
        return name !== content.name ? sformSetField('name', content.name) : null
      } else {
        return name !== content ? sformSetField('name', content) : null
      }
    } else {
      return sformSetField('name', '')
    }
  }, [content, sformSetField, name, image])

  const newResourceProps = useMemo<NewResourceProps>(() => {
    return {
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}),
      stepProps: { ...stepProps, nextStep, imageUrl }, //FIXME: stepProps are created in `nextStep()`, so they're static
    }
  }, [nextStep, stepProps, imageUrl])

  console.log({ vals: form.values, step: newResourceProps.stepProps })

  return newResourceProps && [newResourceProps]
}
