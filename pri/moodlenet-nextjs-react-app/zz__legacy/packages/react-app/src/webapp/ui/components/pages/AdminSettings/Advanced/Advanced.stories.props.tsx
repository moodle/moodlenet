import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import type { FC } from 'react'
import type { AdminSettingsItem } from '../AdminSettings'
import type { AdvancedFormValues, AdvancedProps } from './Advanced'
import { Advanced, AdvancedMenu } from './Advanced'

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
export const useElements = (): AdminSettingsItem => {
  return {
    Menu: AdvancedMenu,
    Content: AdvancedItem,
    key: 'content-advanced',
  }
}
