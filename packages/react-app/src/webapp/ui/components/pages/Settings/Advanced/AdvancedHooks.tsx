import { useFormik } from 'formik'
import { useContext, useMemo } from 'react'
import { SettingsCtx } from '../../../../../web-lib.mjs'
import { AdvancedFormValues, AdvancedProps } from './Advanced.js'

export const useAdvancedProps = (): AdvancedProps => {
  const { devMode, toggleDevMode } = useContext(SettingsCtx)

  const form = useFormik<AdvancedFormValues>({
    initialValues: { devMode },
    async onSubmit() {
      toggleDevMode()
    },
    enableReinitialize: true,
  })

  const AdvancedProps = useMemo<AdvancedProps>(() => {
    return {
      form,
    }
  }, [form])

  return AdvancedProps
}
