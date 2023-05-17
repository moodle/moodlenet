import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import type { FC } from 'react'
import { defaultAppearanceData } from '../../../../../../common/exports.mjs'
import type { AppearanceData } from '../../../../../../common/types.mjs'
import type { SettingsItem } from '../Settings/Settings.js'
import type { AppearanceProps } from './Appearance.js'
import { Appearance, AppearanceMenu } from './Appearance.js'

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

const AppearanceItem: FC = () => <Appearance {...useAppearanceStoryProps()} />
export const useElements = (): SettingsItem => {
  return {
    Menu: AppearanceMenu,
    Content: AppearanceItem,
    key: 'content-appearance',
  }
}
