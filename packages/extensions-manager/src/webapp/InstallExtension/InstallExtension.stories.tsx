import { PrimaryButton } from '@moodlenet/component-library'
import { SettingsItem } from '@moodlenet/react-app/ui'
import { InstallExtensionProps } from './InstallExtension.js'
import { SettingsInstallMenu } from './SettingsInstall.js'

export const useInstallExtensionStoryProps = (overrides?: {
  // editFormValues?: Partial<InstallExtensionData>
  props?: Partial<InstallExtensionProps>
}): InstallExtensionProps => {
  return {
    // form: useFormik<InstallExtensionData>({
    //   onSubmit: action('submit InstallExtension settings'),
    //   // validationSchema,
    //   initialValues: {
    //     color: '',
    //     customStyle: baseStyle(),
    //     ...overrides?.editFormValues,
    //   },
    // }),
    ...overrides?.props,
  }
}

export const useElements = (): SettingsItem => {
  // const props = useInstallExtensionStoryProps()
  return {
    Menu: SettingsInstallMenu,
    // Content: SettingsInstallContent,
    Content: <PrimaryButton>Hola</PrimaryButton>,
  }
}
