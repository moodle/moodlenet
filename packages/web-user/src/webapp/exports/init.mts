import { AddToCollectionButtonByResourceContextContainer } from '@moodlenet/collection/webapp'
import type { ResourcePageGeneralActionsAddonItem } from '@moodlenet/ed-resource/webapp'
import { registerResourcePagePluginHook } from '@moodlenet/ed-resource/webapp'
import type {
  HeaderAddonRegItem,
  PkgAddOns,
  SettingsSectionItem,
} from '@moodlenet/react-app/webapp'
import {
  HeaderPlugins,
  registerAppRoutes,
  registerMainAppPluginHook,
  registerSettingsPagePluginHook,
  type MainAppPluginHookResult,
} from '@moodlenet/react-app/webapp'
import { useContext, useMemo } from 'react'
import '../shell.mjs'

import MainWrapper from '../MainWrapper.js'
import { pkgRoutes } from '../routes.js'
import {
  LoginButtonContainer,
  SignupButtonContainer,
} from '../ui/components/molecules/AccessButtons/AccessContainers.js'
import { AddMenuContainer } from '../ui/components/molecules/AddMenu/AddMenuContainer.js'
import { AvatarMenuContainer } from '../ui/components/molecules/AvatarMenu/AvatarMenuContainer.js'
import { UsersContainer, UsersMenu } from '../ui/components/organisms/Roles/UsersContainer.js'
import { AuthCtx } from './webapp.mjs'

registerAppRoutes(pkgRoutes)

registerMainAppPluginHook(function useMainAppContext() {
  const mainAppPlugin = useMemo<MainAppPluginHookResult>(
    () => ({
      MainWrapper,
    }),
    [],
  )
  return mainAppPlugin
})

registerSettingsPagePluginHook(function useSettingsPagePluregisterAddOn({
  useSettingsSectionAddons,
}) {
  const addons = useMemo<PkgAddOns<SettingsSectionItem>>(
    () => ({
      default: {
        Content: UsersContainer,
        Menu: UsersMenu,
      },
    }),
    [],
  )
  useSettingsSectionAddons(addons)
})

registerResourcePagePluginHook(function useResourcePage({ useGeneralActionsAddons }) {
  const webUserCtx = useContext(AuthCtx)
  const isAuthNotRoot = webUserCtx.isAuthenticated && !webUserCtx.clientSessionData.isRoot
  const addOns = useMemo<PkgAddOns<ResourcePageGeneralActionsAddonItem>>(
    () => ({
      addToCollectionButton: isAuthNotRoot
        ? { Item: AddToCollectionButtonByResourceContextContainer }
        : null,
    }),
    [isAuthNotRoot],
  )
  useGeneralActionsAddons(addOns)
})

HeaderPlugins.register(function useRegisterMainHeader({ useRightAddons }) {
  const { isAuthenticated, clientSessionData } = useContext(AuthCtx)
  const isRoot = !!clientSessionData?.isRoot

  const headerRightAddons = useMemo<PkgAddOns<HeaderAddonRegItem> | null>(() => {
    return isAuthenticated
      ? {
          addMenu: isRoot ? null : { Item: AddMenuContainer },
          avatarMenu: { Item: AvatarMenuContainer },
        }
      : {
          loginButton: { Item: LoginButtonContainer },
          signupButton: { Item: SignupButtonContainer },
        }
  }, [isRoot, isAuthenticated])

  useRightAddons(headerRightAddons)
})
