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

LoginPlugins.register(function useLoginMethod() {
  const loginMethod = useMemo(
    () => ({
      default: { Icon: LoginIcon, Panel: LoginPanelContainer },
    }),
    [],
  )
  return {
    loginMethod,
  }
})
SignupPlugins.register(function useSignupMethod() {
  const signupMethod = useMemo(
    () => ({
      default: { Icon: SignupIcon, Panel: SignUpPanelContainer },
    }),
    [],
  )
  return {
    signupMethod,
  }
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
