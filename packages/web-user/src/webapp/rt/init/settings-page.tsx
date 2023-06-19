import { GeneralMenu } from '@moodlenet/react-app/ui'
import { AdvancedMenu } from '../../ui/exports/ui.mjs'
import { GeneralSettingsContainer } from '../page/settings/sections/GeneralSettingsContainer.js'
import { LMSSettingsContainer } from '../page/settings/sections/LMSSettingsContainer.js'
import { UserSettingsPagePlugin } from '../page/settings/UserSettingsHooks.js'

UserSettingsPagePlugin.register(function useUserSettingsPagePlugin() {
  return {
    settingsItems: {
      general: {
        Content: GeneralSettingsContainer,
        Menu: GeneralMenu,
      },
      lms: {
        Content: LMSSettingsContainer,
        Menu: AdvancedMenu,
      },
    },
  }
})
