import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import { defaultAppearanceData } from '../../../../../../common/index.mjs'
import { AppearanceData } from '../../../../../../common/types.mjs'
import { SettingsItem } from '../Settings.js'
import { Appearance, AppearanceMenu, AppearanceProps } from './Appearance.js'

export const useAppearanceStoryProps = (overrides?: {
  editFormValues?: Partial<AppearanceData>
  props?: Partial<AppearanceProps>
}): AppearanceProps => {
  return {
    form: useFormik<AppearanceData>({
      onSubmit: action('submit Appearance settings'),
      // validationSchema,
      initialValues: {
        ...defaultAppearanceData,
        ...overrides?.editFormValues,
      },
    }),
    ...overrides?.props,
  }
}

export const useElements = (): SettingsItem => {
  const props = useAppearanceStoryProps()
  return {
    Menu: AppearanceMenu,
    Content: { Item: () => <Appearance {...props} />, key: 'content-appearance' },
  }
}
