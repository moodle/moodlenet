import { registerAppRoutes } from '@moodlenet/react-app/webapp'
import { GeneralSettingsPlugin, LoginPlugins, SignupPlugins } from '@moodlenet/web-user/webapp'
import { useMemo } from 'react'
import { routes } from '../routes.js'
import '../shell.mjs'
import { LoginIcon } from '../../../../../../app-nextjs-moodlenet/src/app/(simple-layout)/login/@emailPwd/Login/Login.js'
import { LoginPanelContainer } from '../../../../../../app-nextjs-moodlenet/src/app/(simple-layout)/login/@emailPwd/Login/LoginContainer.js'
import { SignUpPanelContainer } from '../../../../../../app-nextjs-moodlenet/src/app/(simple-layout)/signup/Signup/SignUpHooks.js'
import { SimpleEmailUserSettingsContainer } from '../../../../../../app-nextjs-moodlenet/src/app/(simple-layout)/signup/SimpleEmailUserSettingsContainer.js'
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
