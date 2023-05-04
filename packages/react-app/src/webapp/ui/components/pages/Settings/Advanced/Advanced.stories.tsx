import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import type { FC } from 'react'
import type { SettingsItem } from '../Settings/Settings.js'
import type { AdvancedFormValues, AdvancedProps } from './Advanced.js'
import { Advanced, AdvancedMenu } from './Advanced.js'

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

const AdvancedItem: FC = () => <Advanced {...useAdvancedStoryProps()} />
export const useElements = (): SettingsItem => {
  return {
    Menu: AdvancedMenu,
    Content: { Item: AdvancedItem, key: 'content-advanced' },
  }
}
