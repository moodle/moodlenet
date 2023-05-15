import { AddToCollectionButtonByResourceContextContainer } from '@moodlenet/collection/webapp'
import { registerResourcePagePluginHook } from '@moodlenet/ed-resource/webapp'
import type { HeaderAddonRegItem, PkgAddOns } from '@moodlenet/react-app/webapp'
import {
  registerAppRoutes,
  registerMainAppPluginHook,
  registerMainHeaderPluginHook,
  registerSettingsPagePluginHook,
} from '@moodlenet/react-app/webapp'
import { useContext, useMemo } from 'react'

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
  return {
    MainWrapper,
  }
})

registerSettingsPagePluginHook(function useSettingsPagePluregisterAddOn({
  useSettingsSectionAddons,
}) {
  const addons = useMemo(
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
  useGeneralActionsAddons({
    addToCollectionButton:
      webUserCtx.isAuthenticated && !webUserCtx.clientSessionData.isRoot
        ? { Item: AddToCollectionButtonByResourceContextContainer }
        : null,
  })
})

registerMainHeaderPluginHook(function useRegisterMainHeader({ useHeaderRightAddons }) {
  const { isAuthenticated, clientSessionData } = useContext(AuthCtx)
  const isRoot = !!clientSessionData?.isRoot
  const headerAddons = useMemo<PkgAddOns<HeaderAddonRegItem> | null>(() => {
    if (!isAuthenticated) {
      return {
        loginButton: { Item: LoginButtonContainer },
        signupButton: { Item: SignupButtonContainer },
      }
    }
    return {
      addMenu: isRoot ? null : { Item: AddMenuContainer },
      avatarMenu: { Item: AvatarMenuContainer },
    }
  }, [isRoot, isAuthenticated])
  useHeaderRightAddons(headerAddons)
})
