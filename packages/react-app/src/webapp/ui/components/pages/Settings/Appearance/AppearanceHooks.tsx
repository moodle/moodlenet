import { useFormik } from 'formik'
import { useContext, useMemo } from 'react'
import { AppearanceData } from '../../../../../../types/data.mjs'
import { SettingsCtx } from '../../../../../context/SettingsContext.js'
import { AppearanceProps } from './Appearance.js'

export const useAppearanceProps = (): AppearanceProps => {
  const settingsContext = useContext(SettingsCtx)

  const form = useFormik<AppearanceData>({
    initialValues: settingsContext.appearanceData,
    async onSubmit(newAppearanceData) {
      settingsContext.saveAppearanceData(newAppearanceData)
    },
  })

  const appearanceProps = useMemo<AppearanceProps>(() => {
    return {
      appearanceData: settingsContext.appearanceData,
      form,
    }
  }, [form, settingsContext.appearanceData])

  return appearanceProps
}
