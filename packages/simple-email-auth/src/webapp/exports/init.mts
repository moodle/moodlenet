import { registerAppRoutes } from '@moodlenet/react-app/webapp'
import { GeneralSettingsPlugin, LoginPlugins, SignupPlugins } from '@moodlenet/web-user/webapp'
import { useMemo } from 'react'
import { routes } from '../routes.js'
import '../shell.mjs'
import { LoginIcon } from '../ui/Login/Login.js'
import { LoginPanelContainer } from '../ui/Login/LoginContainer.js'
import { SignUpPanelContainer } from '../ui/Signup/SignUpHooks.js'
import { SimpleEmailUserSettingsContainer } from '../ui/SimpleEmailUserSettingsContainer.js'
import { SignupIcon } from './ui.mjs'

registerAppRoutes({ routes })

LoginPlugins.register(function useLoginMethod({ useLoginMethod }) {
  const addons = useMemo(
    () => ({
      default: { Icon: LoginIcon, Panel: LoginPanelContainer },
    }),
    [],
  )
  useLoginMethod(addons)
})
SignupPlugins.register(function useSignupMethod({ useSignupMethod }) {
  const addons = useMemo(
    () => ({
      default: { Icon: SignupIcon, Panel: SignUpPanelContainer },
    }),
    [],
  )
  useSignupMethod(addons)
})

// AdminSettingsPagePlugins.register(function useAdminSettingsPageHook({ useAdminSettingsSection }) {
//   const addons = useMemo<PkgAddOns<AdminSettingsSectionItem>>(
//     () => ({
//       default: { Content: AdminSettingsContent, Menu: AdminSettingsMenu },
//     }),
//     [],
//   )
//   useAdminSettingsSection(addons)
// })

GeneralSettingsPlugin.register(function useGeneralSettingsPlugin() {
  return {
    mainColumn: {
      emailAuthentication: { Item: SimpleEmailUserSettingsContainer },
    },
  }
})
