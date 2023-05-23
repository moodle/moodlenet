import { AdminSettingsCtx } from '@moodlenet/react-app/webapp'
import { useFormik } from 'formik'
import { useContext, useMemo } from 'react'
import { shell } from '../../../shell.mjs'
import type {
  InstallExtensionPropsControlled,
  InstallLocalPathExtensionFormValues,
} from './InstallExtension.js'

export const useInstallExtensionProps = (): InstallExtensionPropsControlled => {
  const installLocalPathExtensionForm = useFormik<InstallLocalPathExtensionFormValues>({
    initialValues: { localPath: '' },
    onSubmit({ localPath }) {
      return shell.rpc.me.install([
        {
          fromFolder: localPath,
          type: 'pack-folder',
        },
      ])
    },
  })
  const { devMode } = useContext(AdminSettingsCtx)

  const installExtensionPropsControlled = useMemo<InstallExtensionPropsControlled>(() => {
    const props: InstallExtensionPropsControlled = {
      devMode,
      extensions: [],
      installLocalPathExtensionForm,
      setIsInstalling() {
        return
      },
    }
    return props
  }, [installLocalPathExtensionForm, devMode])

  return installExtensionPropsControlled
}
