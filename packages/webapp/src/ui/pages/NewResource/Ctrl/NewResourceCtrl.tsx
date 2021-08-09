import { AssetRefInput } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { nodeSlugId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { DistOmit } from '@moodlenet/common/lib/utils/types'
import { Reducer, useCallback, useEffect, useMemo, useReducer } from 'react'
import { iscedFields, iscedGrades, iso639_3, licenses, resourceTypes } from '../../../../constants/wellKnownNodes'
import { useSession } from '../../../../context/Global/Session'
import { useUploadTempFile } from '../../../../helpers/data'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useFormikBag } from '../../../lib/formik'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import {
  CategoriesDropdown,
  DropdownField,
  LanguagesDropdown,
  LevelDropdown,
  LicenseDropdown,
  MonthDropdown,
  TypeDropdown,
  YearsDropdown,
} from '../FieldsData'
import { NewResourceProps } from '../NewResource'
import { NewResourceFormValues } from '../types'
import { UploadResourceProps } from '../UploadResource/UploadResource'
import {
  useCreateResourceMutation,
  useCreateResourceRelationMutation,
  useNewResourceDataPageLazyQuery,
} from './NewResourceCtrl.gen'

const categoriesOptions: DropdownField = {
  ...CategoriesDropdown,
  options: iscedFields.map(cat => cat.name),
}

const resTypeOptions: DropdownField = {
  ...TypeDropdown,
  options: resourceTypes.map(restype => restype.name),
}

const resGradeOptions: DropdownField = {
  ...LevelDropdown,
  options: iscedGrades.map(grade => grade.name),
}

const langOptions: DropdownField = {
  ...LanguagesDropdown,
  options: iso639_3.map(lang => lang.name),
}

// const resFormatOptions: DropdownField = {
//   ...FormatDropdown,
//   options: fileFormats.map(format => format.name),
// }

const licensesOptions = {
  ...LicenseDropdown,
}

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

  const deleteContent = useCallback(() => sformSetField('content', ''), [sformSetField])

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
            setNextStepProps({
              ...initialSetStepProps,
              step: 'UploadResourceStep',
              state: 'EditData',
              deleteContent,
              formBag,
            })
          }
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
          months: MonthDropdown,
          years: YearsDropdown,
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
          name,
          description,
          level,
          language,
          license,
          type,
          addToCollections,
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

        const resp = await createResourceMut({
          variables: {
            res: {
              nodeType: 'Resource',
              Resource: {
                content: contentAssetRef,
                description,
                name,
                image: imageAssetRef,
              },
            },
          },
        })
        const resource = resp.data?.resource
        if (resource?.__typename === 'CreateNodeMutationSuccess' && resource.node.__typename === 'Resource') {
          const resId = resource.node.id

          const Lang = iso639_3.find(_ => _.name === language)!
          const langId = nodeSlugId(Lang._type, Lang._slug)
          await createResourceRelMut({
            variables: { edge: { edgeType: 'Features', from: resId, to: langId, Features: {} } },
          })

          const License = licenses.find(_ => license?.toLowerCase().startsWith(_.code.toLowerCase()))!
          const licenseId = nodeSlugId(License._type, License._slug)
          await createResourceRelMut({
            variables: { edge: { edgeType: 'Features', from: resId, to: licenseId, Features: {} } },
          })

          const Type = resourceTypes.find(_ => _.name === type)!
          const typeId = nodeSlugId(Type._type, Type._slug)
          await createResourceRelMut({
            variables: { edge: { edgeType: 'Features', from: resId, to: typeId, Features: {} } },
          })

          const Grade = iscedGrades.find(_ => _.name === level)!
          const gradeId = nodeSlugId(Grade._type, Grade._slug)
          await createResourceRelMut({
            variables: { edge: { edgeType: 'Features', from: resId, to: gradeId, Features: {} } },
          })

          const IscedF = iscedFields.find(_ => _.name === category)!
          const iscedFId = nodeSlugId(IscedF._type, IscedF._slug)
          await createResourceRelMut({
            variables: { edge: { edgeType: 'Features', from: resId, to: iscedFId, Features: {} } },
          })

          await addToCollections.map(async collName => {
            const collectionId = mycollections.find(_ => _.name === collName)!.id
            await createResourceRelMut({
              variables: { edge: { edgeType: 'Features', to: resId, from: collectionId, Features: {} } },
            })
          })
          console.log('save', resource.node)
        }
      }
    }
    return undefined
  }, [
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
  ])

  const { content, name } = sform.values
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
  }, [content, sformSetField, name])

  const newResourceProps = useMemo<NewResourceProps>(() => {
    return {
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}),
      stepProps: { ...stepProps, nextStep },
    }
  }, [nextStep, stepProps])

  //  console.log({ vals: form.values, step: newResourceProps.stepProps })

  return newResourceProps && [newResourceProps]
}
