import type { PkgAddOns, SettingsSectionItem } from '@moodlenet/react-app/webapp'
import {
  registerMainAppPluginHook,
  SettingsPagePlugins,
  type MainAppPluginHookResult,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import '../shell.mjs'

import { ExtensionsMenu } from '../components/pages/Extensions/Extensions.js'
import { ExtensionsContainer } from '../components/pages/Extensions/ExtensionsContainer.js'
import MainWrapper from '../MainWrapper.js'

registerMainAppPluginHook(function useMainAppContext() {
  const mainAppPlugin = useMemo<MainAppPluginHookResult>(
    () => ({
      MainWrapper,
    }),
    [],
  )
  return mainAppPlugin
})

SettingsPagePlugins.register(function useSettingsPagePluginHook({ useSettingsSection }) {
  const addons = useMemo<PkgAddOns<SettingsSectionItem>>(
    () => ({
      default: {
        Menu: ExtensionsMenu,
        Content: ExtensionsContainer,
      },
    }),
    [],
  )
  useSettingsSection(addons)
})
