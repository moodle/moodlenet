import { GeneralMenu } from '@moodlenet/react-app/ui'
import { AdvancedMenu } from '../../ui/exports/ui.mjs'
import { AdvancedSettingsContainer } from '../page/settings/sections/AdvancedSettingsContainer.js'
import { GeneralSettingsContainer } from '../page/settings/sections/GeneralSettingsContainer.js'
import { UserSettingsPagePlugin } from '../page/settings/UserSettingsHooks.js'

UserSettingsPagePlugin.register(function useUserSettingsPagePlugin() {
  return {
    settingsItems: {
      general: {
        Content: GeneralSettingsContainer,
        Menu: GeneralMenu,
      },
      advanced: {
        Content: AdvancedSettingsContainer,
        Menu: AdvancedMenu,
      },
    },
  }
})
