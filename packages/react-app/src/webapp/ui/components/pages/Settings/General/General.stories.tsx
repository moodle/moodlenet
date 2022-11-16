import { OrganizationData } from '@moodlenet/organization'
import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import { object, SchemaOf, string } from 'yup'
import { SettingsItem } from '../Settings.js'
import { General, GeneralFormValues, GeneralMenu, GeneralProps } from './General.js'

export const validationSchema: SchemaOf<GeneralFormValues> = object({
  instanceName: string().max(160).min(3).required(/* t */ `Please provide an instance name`),
  landingTitle: string().max(160).min(3).required(/* t */ `Please provide a landing title`),
  landingSubtitle: string().max(4096).min(3).required(/* t */ `Please provide a landing subtitle`),
})

export const useGeneralStoryProps = (overrides?: {
  editFormValues?: Partial<OrganizationData>
  props?: Partial<GeneralProps>
}): GeneralProps => {
  return {
    form: useFormik<GeneralFormValues>({
      onSubmit: action('submit edit'),
      validationSchema,
      initialValues: {
        instanceName: 'MoodleNet',
        landingTitle: 'Find, share and curate open educational resources',
        landingSubtitle: 'Search for resources, subjects, collections or people',
        ...overrides?.editFormValues,
      },
    }),
    // updateExtensions: action('Updating extensions'),
    updateSuccess: true,
    ...overrides?.props,
  }
}

export const useElements = (): SettingsItem => {
  const props = useGeneralStoryProps()
  return {
    Menu: GeneralMenu,
    Content: { Item: () => <General {...props} />, key: 'content-general' },
  }
}
