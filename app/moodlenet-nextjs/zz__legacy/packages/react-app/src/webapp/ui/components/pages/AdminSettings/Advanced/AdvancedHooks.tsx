import { useFormik } from 'formik'
import { useContext, useMemo } from 'react'
import { AdminSettingsCtx } from '../../../../../context/AdminSettingsContext.js'
import type { AdvancedFormValues, AdvancedProps } from './Advanced.js'

export const useAdvancedProps = (): AdvancedProps => {
  const { devMode, toggleDevMode } = useContext(AdminSettingsCtx)

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
