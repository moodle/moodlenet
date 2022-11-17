import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import { FC } from 'react'
import { defaultAppearanceFormValues } from '../../../../../../common/index.mjs'
import { AppearanceData } from '../../../../../../common/types.mjs'
import { SettingsItem } from '../Settings.js'
import { Appearance, AppearanceFormValues, AppearanceMenu, AppearanceProps } from './Appearance.js'

export const useAppearanceStoryProps = (overrides?: {
  editFormValues?: Partial<AppearanceData>
  props?: Partial<AppearanceProps>
}): AppearanceProps => {
  return {
    form: useFormik<AppearanceFormValues>({
      onSubmit: action('submit Appearance settings'),
      // validationSchema,
      initialValues: {
        ...defaultAppearanceFormValues,
        ...overrides?.editFormValues,
      },
    }),
    ...overrides?.props,
  }
}

const AppearanceItem: FC = () => <Appearance {...useAppearanceStoryProps()} />
export const useElements = (): SettingsItem => {
  return {
    Menu: AppearanceMenu,
    Content: { Item: AppearanceItem, key: 'content-appearance' },
  }
}
