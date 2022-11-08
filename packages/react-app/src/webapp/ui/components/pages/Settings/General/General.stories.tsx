import { OrganizationData } from '@moodlenet/organization'
import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import { SettingsItem } from '../Settings.js'
import { General, GeneralMenu, GeneralProps } from './General.js'

export const useGeneralStoryProps = (overrides?: {
  editFormValues?: Partial<OrganizationData>
  props?: Partial<GeneralProps>
}): GeneralProps => {
  return {
    form: useFormik<OrganizationData>({
      onSubmit: action('submit general settings'),
      // validationSchema,
      initialValues: {
        instanceName: 'MoodleNet',
        landingTitle: 'Find, share and curate open educational resources',
        landingSubtitle: 'Search for resources, subjects, collections or people',
        logo: '',
        smallLogo: '',
        ...overrides?.editFormValues,
      },
    }),
    ...overrides?.props,
  }
}

export const useElements = (): SettingsItem => {
  const props = useGeneralStoryProps()
  return { Menu: GeneralMenu, Content: <General {...props} /> }
}
