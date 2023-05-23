import type { AdminSettingsSectionItem, PkgAddOns } from '@moodlenet/react-app/webapp'
import {
  AdminSettingsPagePlugins,
  registerMainAppPluginHook,
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

AdminSettingsPagePlugins.register(function useSettingsPagePluginHook({ useAdminSettingsSection }) {
  const addons = useMemo<PkgAddOns<AdminSettingsSectionItem>>(
    () => ({
      default: {
        Menu: ExtensionsMenu,
        Content: ExtensionsContainer,
      },
    }),
    [],
  )
  useAdminSettingsSection(addons)
})
