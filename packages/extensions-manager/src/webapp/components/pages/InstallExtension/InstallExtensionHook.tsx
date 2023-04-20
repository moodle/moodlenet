import { SettingsCtx } from '@moodlenet/react-app/webapp'
import { useFormik } from 'formik'
import { useContext, useMemo } from 'react'
import { MainContext } from '../../../MainContext.js'
import {
  InstallExtensionPropsControlled,
  InstallLocalPathExtensionFormValues,
} from './InstallExtension.js'

export const useInstallExtensionProps = (): InstallExtensionPropsControlled => {
  const {
    use: { me },
  } = useContext(MainContext)
  const installLocalPathExtensionForm = useFormik<InstallLocalPathExtensionFormValues>({
    initialValues: { localPath: '' },
    onSubmit({ localPath }) {
      return me.rpc.install([
        {
          fromFolder: localPath,
          type: 'pack-folder',
        },
      ])
    },
  })
  const { devMode } = useContext(SettingsCtx)

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
