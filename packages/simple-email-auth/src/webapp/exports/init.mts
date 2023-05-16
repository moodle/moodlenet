import type { PkgAddOns, SettingsSectionItem } from '@moodlenet/react-app/webapp'
import { registerSettingsPagePluginHook } from '@moodlenet/react-app/webapp'
import { registerLoginMethodHook, registerSignupMethodHook } from '@moodlenet/web-user/webapp'
import { useMemo } from 'react'
import '../shell.mjs'
import { LoginIcon } from '../ui/Login/Login.js'
import { LoginPanelContainer } from '../ui/Login/LoginContainer.js'
import { SignUpPanelContainer } from '../ui/Signup/SignUpHooks.js'
import { SettingsContent, SettingsMenu, SignupIcon } from './ui.mjs'

registerLoginMethodHook(function useLoginMethod({ useLoginMethod }) {
  const addons = useMemo(
    () => ({
      default: { Icon: LoginIcon, Panel: LoginPanelContainer },
    }),
    [],
  )
  useLoginMethod(addons)
})
registerSignupMethodHook(function useSignupMethod({ useSignupMethod }) {
  const addons = useMemo(
    () => ({
      default: { Icon: SignupIcon, Panel: SignUpPanelContainer },
    }),
    [],
  )
  useSignupMethod(addons)
})

registerSettingsPagePluginHook(function useSettingsPageHook({ useSettingsSectionAddons }) {
  const addons = useMemo<PkgAddOns<SettingsSectionItem>>(
    () => ({
      default: { Content: SettingsContent, Menu: SettingsMenu },
    }),
    [],
  )
  useSettingsSectionAddons(addons)
})
