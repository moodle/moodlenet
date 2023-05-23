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
import './shell.mjs'

import { BrowserCollectionList } from '@moodlenet/collection/ui'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import { AuthCtx, BookmarkButtonContainer } from './exports.mjs'
import MainWrapper from './MainWrapper.js'
import { AddMenuContainer } from './menus/AddMenuContainer.js'
import { AvatarMenuContainer } from './menus/AvatarMenuContainer.js'
import { LoginButtonContainer, SignupButtonContainer } from './page/access/AccessContainers.js'
import type { BrowserPluginItem } from './page/bookmarks/BookmarksPageHook.mjs'
import { BookmarksPagePlugin } from './page/bookmarks/BookmarksPageHook.mjs'
import { useMyBookmarkedBrowserCollectionListDataProps } from './page/bookmarks/MyBookmarkedBrowserCollectionListHook.mjs'
import { UsersContainer, UsersMenu } from './page/settings/UsersContainer.js'
import { pkgRoutes } from './routes.js'
import { LikeButtonContainer } from './social-actions/LikeButtonContainer.js'
import { SmallFollowButtonContainer } from './social-actions/SmallFollowButtonContainer.js'

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
      bookMarkButton: {
        Item: () => <BookmarkButtonContainer _key={resourceKey} entityType="resource" />,
      },
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
      followButton: {
        Item: () => <SmallFollowButtonContainer _key={collectionKey} entityType="collection" />,
      },
      bookMarkButton: {
        Item: () => <BookmarkButtonContainer _key={collectionKey} entityType="collection" />,
      },
    }),
    [collectionKey],
  )
  useTopRightItems(socialButtons)
})

BookmarksPagePlugin.register(function useRegisterBookmarksPagePlugin({ useBrowserItems }) {
  const browserPluginItems = useMemo<PkgAddOns<BrowserPluginItem>>(() => {
    const items: PkgAddOns<BrowserPluginItem> = {
      collections: {
        Item: browserMainColumnItemBase => {
          const myBookmarkedBrowserCollectionListDataProps =
            useMyBookmarkedBrowserCollectionListDataProps()
          return (
            <BrowserCollectionList
              {...myBookmarkedBrowserCollectionListDataProps}
              {...browserMainColumnItemBase}
            />
          )
        },
        filters: [],
        name: 'Collections',
      },
    }
    return items
  }, [])
  useBrowserItems(browserPluginItems)
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
