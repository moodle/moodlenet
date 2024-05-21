import {
  AdminSettingsPagePlugins,
  HeaderPlugins,
  MimimalisticHeaderHookPlugin,
  registerAppRoutes,
  registerMainAppPluginHook,
  type MainAppPluginHookResult,
} from '@moodlenet/react-app/webapp'
import { useContext, useMemo } from 'react'
import { AuthCtx } from './exports.mjs'
import './init/bookmark-page.js'
import './init/landing-page.js'
import './init/logged-in-guards.mjs'
import './init/profile-followers-page.js'
import './init/profile-following-page.js'
import './init/search-page.js'
import './init/settings-page.js'
import './init/social-actions.js'

import { href } from '@moodlenet/react-app/common'
import { loginPageRoutePath, SIGNUP_PAGE_ROUTE_BASE_PATH } from '../../common/webapp-routes.mjs'
import { getMiniAccessButtonsHeaderItems } from '../ui/exports/ui.mjs'
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

MimimalisticHeaderHookPlugin.register(function useMimimalisticHeaderHookPlugin() {
  const loginPagePath = loginPageRoutePath()
  return {
    rightItems: {
      accessMiniButtons: getMiniAccessButtonsHeaderItems({
        signupHref: href(SIGNUP_PAGE_ROUTE_BASE_PATH),
        loginHref: href(loginPagePath),
      }),
    },
  }
})
