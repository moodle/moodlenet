import {
  AddToCollectionButtonByResourceContextContainer,
  CollectionCardPlugins,
} from '@moodlenet/collection/webapp'
import type { ResourcePageGeneralActionsAddonItem } from '@moodlenet/ed-resource/webapp'
import { ResourceCardPlugins, ResourcePagePlugins } from '@moodlenet/ed-resource/webapp'
import type {
  HeaderAddonRegItem,
  PkgAddOns,
  SettingsSectionItem,
} from '@moodlenet/react-app/webapp'
import {
  HeaderPlugins,
  registerAppRoutes,
  registerMainAppPluginHook,
  SettingsPagePlugins,
  type MainAppPluginHookResult,
} from '@moodlenet/react-app/webapp'
import { useContext, useMemo } from 'react'
import '../shell.mjs'

import type { AddonItemNoKey } from '@moodlenet/component-library'
import MainWrapper from '../MainWrapper.js'
import { pkgRoutes } from '../routes.js'
import { SmallFollowButtonContainer } from '../ui/components/atoms/FollowButton/SmallFollowButtonContainer.js'
import { LikeButtonContainer } from '../ui/components/atoms/LikeButton/LikeButtonContainer.js'
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

SettingsPagePlugins.register(function useSettingsPagePluregisterAddOn({ useSettingsSection }) {
  const addons = useMemo<PkgAddOns<SettingsSectionItem>>(
    () => ({
      default: {
        Content: UsersContainer,
        Menu: UsersMenu,
      },
    }),
    [],
  )
  useSettingsSection(addons)
})

ResourcePagePlugins.register(function useResourcePage({ useGeneralAction }) {
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
  useGeneralAction(addOns)
})

HeaderPlugins.register(function useRegisterMainHeader({ useRightItems }) {
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

  useRightItems(headerRightAddons)
})

ResourceCardPlugins.register(function useRegisterCardPlugin({
  useTopRightItems, //  useTopLeftItems,
  resourceKey,
}) {
  const socialButtons = useMemo<PkgAddOns<AddonItemNoKey>>(
    () => ({
      likeButton: {
        Item: () => <LikeButtonContainer _key={resourceKey} entityType={'resource'} />,
      },
      // bookMarkButton: { Item: BookmarkButtonContainer },
    }),
    [resourceKey],
  )
  useTopRightItems(socialButtons)
})

CollectionCardPlugins.register(function useRegisterCardPlugin({
  useTopRightItems, //  useTopLeftItems,
  collectionKey,
}) {
  const socialButtons = useMemo<PkgAddOns<AddonItemNoKey>>(
    () => ({
      // likeButton: { Item: () => <LikeButtonContainer _key={resourceKey}  entityType="collection"/> },
      followButton: {
        Item: () => <SmallFollowButtonContainer _key={collectionKey} entityType="collection" />,
      },
      // bookMarkButton: { Item: BookmarkButtonContainer },
    }),
    [collectionKey],
  )
  useTopRightItems(socialButtons)
})

/* @ETTO example more item
   const bottomLeftAddone = useMemo<PkgAddOns<ItemWithoutKey> | null>(() => {
    return {
      pippo: { Item: LikeButtonContainer },
      ciccio: { Item: BookmarkButtonContainer },
    }
  }, [])
*/
//  useTopLeftItems(bottomLeftAddone)
