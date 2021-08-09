import { useMemo } from 'react'
import { iscedFields, iscedGrades, iso639_3, licenses, resourceTypes } from '../../../../constants/wellKnownNodes'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useFormikBag } from '../../../lib/formik'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { NewResourceProps } from '../NewResource'
import { NewResourceFormValues } from '../types'

export type NewResourceCtrlProps = {}
export const useNewResourceCtrl: CtrlHook<NewResourceProps, NewResourceCtrlProps> = () => {
  iscedFields
  iscedGrades
  iso639_3
  licenses
  resourceTypes

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

  const stepProps = useMemo<NewResourceProps['stepProps']>(() => {
    if (!form.values.content) {
      return {
        step: 'UploadResourceStep',
        state: 'ChooseResource',
        formBag,
        imageUrl: '',
        categories: iscedFields.map(),
      }
    }
  }, [])

  const newResourceProps = useMemo<NewResourceProps>(() => {
    return {
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}),
      stepProps,
    }
  }, [])
  return newResourceProps && [newResourceProps]
}
