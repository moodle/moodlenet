import { SettingsItem } from '@moodlenet/react-app/ui'
import { useEffect, useState } from 'react'
import { InstallExtensionProps } from './InstallExtension.js'
import { SettingsInstallContent, SettingsInstallMenu } from './SettingsInstall.js'

export const useInstallExtensionStoryProps = (overrides?: {
  // editFormValues?: Partial<InstallExtensionData>
  props?: Partial<InstallExtensionProps>
}): InstallExtensionProps => {
  const [readme, setReadme] = useState('')
  useEffect(() => {
    fetch(`https://registry.npmjs.org/@moodlenet/ce-platform`, {
      // mode: 'no-cors',
    })
      .then(_ => _.json())
      .then(({ readme }) => setReadme(readme))
  }, [])

  return {
    selectedExt: {
      readme: readme,
    },
    // devMode: false,
    // searchPkgResp: []
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
  const props = useInstallExtensionStoryProps()
  return {
    Menu: SettingsInstallMenu,
    Content: <SettingsInstallContent selectedExt={props.selectedExt} />,
  }
}
