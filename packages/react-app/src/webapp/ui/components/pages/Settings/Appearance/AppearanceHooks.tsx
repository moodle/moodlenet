import { useFormik } from 'formik'
import { useContext, useMemo } from 'react'
import { AppearanceData } from '../../../../../../common/types.mjs'
import { SettingsCtx } from '../../../../../context/SettingsContext.js'
import { AppearanceProps } from './Appearance.js'

export const useAppearanceProps = (): AppearanceProps => {
  const { appearanceData, saveAppearanceData } = useContext(SettingsCtx)

  const form = useFormik<AppearanceData>({
    initialValues: appearanceData,
    async onSubmit(newAppearanceData) {
      await saveAppearanceData(newAppearanceData)
    },
    enableReinitialize: true,
  })

  const appearanceProps = useMemo<AppearanceProps>(() => {
    return {
      appearanceData,
      form,
    }
  }, [form, appearanceData])

  return appearanceProps
}
