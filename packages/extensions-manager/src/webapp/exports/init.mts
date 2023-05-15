import {
  registerMainAppPluginHook,
  registerSettingsPagePluginHook,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'

import { ExtensionsMenu } from '../components/pages/Extensions/Extensions.js'
import { ExtensionsContainer } from '../components/pages/Extensions/ExtensionsContainer.js'
import MainWrapper from '../MainWrapper.js'

registerMainAppPluginHook(function useMainAppContext() {
  return {
    MainWrapper,
  }
})

registerSettingsPagePluginHook(function useSettingsPagePluginHook({ registerAddOn }) {
  const addons = useMemo(
    () => ({
      main: {
        Menu: ExtensionsMenu,
        Content: ExtensionsContainer,
      },
    }),
    [],
  )
  registerAddOn(addons)
})
