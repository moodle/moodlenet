import {
  AdminSettingsPagePlugins,
  HeaderPlugins,
  registerAppRoutes,
  registerMainAppPluginHook,
  type MainAppPluginHookResult,
} from '@moodlenet/react-app/webapp'
import { useContext, useMemo } from 'react'
import './ed-resource/init.js'
import { AuthCtx } from './exports.mjs'
import './init/bookmark-page.js'
import './init/following-page.js'
import './init/landing-page.js'
import './init/profile-followers-page.js'
import './init/search-page.js'
import './init/settings-page.js'
import './init/social-actions.js'

import { useSwichAddonsByAuth } from './lib/AddonsByUserRule.js'
import MainWrapper from './MainWrapper.js'
import { menuAddonsDefaultSetting, menuHeaderButtonsAuthAddons } from './menus/menuAddons.js'
import { pkgRoutes } from './routes.js'

registerAppRoutes(pkgRoutes)

registerMainAppPluginHook(() => useMemo<MainAppPluginHookResult>(() => ({ MainWrapper }), []))

HeaderPlugins.register(() => ({
  rightItems: useSwichAddonsByAuth(menuHeaderButtonsAuthAddons),
}))

AdminSettingsPagePlugins.register(function useAdminSettingsPagePlugin() {
  const authCtx = useContext(AuthCtx)

  return {
    adminSettingsSection: menuAddonsDefaultSetting,
    denyAccess: !(authCtx.clientSessionData?.isAdmin || authCtx.clientSessionData?.isRoot),
  }
})
