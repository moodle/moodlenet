import type { PkgAddOns, SettingsSectionItem } from '@moodlenet/react-app/webapp'
import { SettingsPagePlugins } from '@moodlenet/react-app/webapp'
import { LoginPlugins, SignupPlugins } from '@moodlenet/web-user/webapp'
import { useMemo } from 'react'
import '../shell.mjs'
import { LoginIcon } from '../ui/Login/Login.js'
import { LoginPanelContainer } from '../ui/Login/LoginContainer.js'
import { SignUpPanelContainer } from '../ui/Signup/SignUpHooks.js'
import { SettingsContent, SettingsMenu, SignupIcon } from './ui.mjs'

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

SettingsPagePlugins.register(function useSettingsPageHook({ useSettingsSection }) {
  const addons = useMemo<PkgAddOns<SettingsSectionItem>>(
    () => ({
      default: { Content: SettingsContent, Menu: SettingsMenu },
    }),
    [],
  )
  useSettingsSection(addons)
})
