import { useFormik } from 'formik'
import { useMemo } from 'react'
import {
  InstallExtensionPropsControlled,
  InstallLocalPathExtensionFormValues,
} from './InstallExtension.js'

export const useInstallExtensionProps = (): InstallExtensionPropsControlled => {
  const installLocalPathExtensionForm = useFormik<InstallLocalPathExtensionFormValues>({
    initialValues: { localPath: '' },
    onSubmit() {
      return
    },
  })
  const installExtensionPropsControlled = useMemo<InstallExtensionPropsControlled>(() => {
    const props: InstallExtensionPropsControlled = {
      devMode: false,
      extensions: [],
      installLocalPathExtensionForm,
      setIsInstalling() {
        return
      },
    }
    return props
  }, [installLocalPathExtensionForm])

  return installExtensionPropsControlled
}
