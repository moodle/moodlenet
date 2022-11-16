import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import { SettingsItem } from '../Settings.js'
import { Advanced, AdvancedFormValues, AdvancedMenu, AdvancedProps } from './Advanced.js'

export const useAdvancedStoryProps = (overrides?: {
  editFormValues?: Partial<AdvancedFormValues>
  props?: Partial<AdvancedProps>
}): AdvancedProps => {
  return {
    form: useFormik<AdvancedFormValues>({
      onSubmit: action('Submit Advanced settings'),
      // validationSchema,
      initialValues: {
        devMode: false,
        ...overrides?.editFormValues,
      },
    }),
    ...overrides?.props,
  }
}

export const useElements = (): SettingsItem => {
  const props = useAdvancedStoryProps()
  return {
    Menu: AdvancedMenu,
    Content: { Item: () => <Advanced {...props} />, key: 'content-advanced' },
  }
}
