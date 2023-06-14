import {
  AdminSettingsPagePlugins,
  HeaderPlugins,
  registerAppRoutes,
  registerMainAppPluginHook,
  type MainAppPluginHookResult,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import './init/bookmark-page.js'
import './init/following-page.js'
import './init/landing-page.js'
import './init/social-actions.js'
import { useSwichAddonsByAuth } from './lib/AddonsByUserRule.js'
import MainWrapper from './MainWrapper.js'
import { menuAddonsDefaultSetting, menuHeaderButtonsAuthAddons } from './menus/menuAddons.js'
import { pkgRoutes } from './routes.js'
import './shell.mjs'

registerAppRoutes(pkgRoutes)

registerMainAppPluginHook(() => useMemo<MainAppPluginHookResult>(() => ({ MainWrapper }), []))

HeaderPlugins.register(() => ({
  rightItems: useSwichAddonsByAuth(menuHeaderButtonsAuthAddons),
}))

AdminSettingsPagePlugins.register(({ useAdminSettingsSection }) =>
  useAdminSettingsSection(menuAddonsDefaultSetting),
)
