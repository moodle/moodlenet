import type { AdminSettingsSectionItem } from '@moodlenet/react-app/webapp'
import {
  AdminSettingsPagePlugins,
  registerMainAppPluginHook,
  type MainAppPluginHookResult,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import '../shell.mjs'

import type { AddOnMap } from '@moodlenet/core/lib'
import { ExtensionsMenu } from '../components/pages/Extensions/Extensions'
import { ExtensionsContainer } from '../components/pages/Extensions/ExtensionsContainer'
import MainWrapper from '../MainWrapper'

registerMainAppPluginHook(function useMainAppContext() {
  const mainAppPlugin = useMemo<MainAppPluginHookResult>(
    () => ({
      MainWrapper,
    }),
    [],
  )
  return mainAppPlugin
})

AdminSettingsPagePlugins.register(function useSettingsPagePluginHook() {
  const adminSettingsSection = useMemo<AddOnMap<AdminSettingsSectionItem>>(
    () => ({
      default: {
        Menu: ExtensionsMenu,
        Content: ExtensionsContainer,
      },
    }),
    [],
  )
  return {
    adminSettingsSection,
  }
})
