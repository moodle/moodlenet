import { useFormik } from 'formik'
import { useContext, useMemo } from 'react'
import type { AppearanceData } from '../../../../../../common/types.mjs'
import { SettingsCtx } from '../../../../../context/SettingsContext.js'
import type { AppearanceProps } from './Appearance.js'

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
    const props: AppearanceProps = {
      form,
    }
    return props
  }, [form])

  return appearanceProps
}
