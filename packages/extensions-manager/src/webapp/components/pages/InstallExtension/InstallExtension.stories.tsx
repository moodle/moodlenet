import { SettingsItem } from '@moodlenet/react-app/ui'
import { action } from '@storybook/addon-actions'
import { useEffect, useState } from 'react'
import InstallExtension, {
  InstallExtensionMenu,
  InstallExtensionProps,
} from './InstallExtension.js'

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
    // selectedExt: {
    //   readme: readme,
    // },
    devMode: true,
    setSelectedExt: action('Extension selected'),
    extensions: [
      {
        name: '@moodlenet/react-app',
        description: 'React App\n The foundations of the web application',
      },
    ],

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
  console.log(props)
  return {
    Menu: InstallExtensionMenu,
    Content: {
      Item: () => <InstallExtension {...props} />,
      key: 'content-install-extension',
    },
  }
}
