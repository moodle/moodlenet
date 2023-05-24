import {
  AddToCollectionButtonByResourceContextContainer as addResourceToCollectionButton,
  CollectionCardPlugins,
  CollectionPagePlugins,
} from '@moodlenet/collection/webapp'
import { ResourceCardPlugins, ResourcePagePlugins } from '@moodlenet/ed-resource/webapp'
import type { HeaderAddonRegItem, PkgAddOns } from '@moodlenet/react-app/webapp'
import {
  HeaderPlugins,
  registerAppRoutes,
  registerMainAppPluginHook,
  type MainAppPluginHookResult,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import './shell.mjs'

import { BrowserCollectionList } from '@moodlenet/collection/ui'
import type { BrowserMainColumnItemBase } from '@moodlenet/react-app/ui'
import { useSwichAddonsWithAuth } from './context/AuthContext.js'
import MainWrapper from './MainWrapper.js'
import { AddMenuContainer } from './menus/AddMenuContainer.js'
import { AvatarMenuContainer } from './menus/AvatarMenuContainer.js'
import { LoginButtonContainer, SignupButtonContainer } from './page/access/AccessContainers.js'
import type { BrowserPluginItem } from './page/bookmarks/BookmarksPageHook.mjs'
import { BookmarksPagePlugin } from './page/bookmarks/BookmarksPageHook.mjs'
import { useMyBookmarkedBrowserCollectionListDataProps as useBrowseBookCollection } from './page/bookmarks/MyBookmarkedBrowserCollectionListHook.mjs'
import { UsersContainer, UsersMenu } from './page/settings/UsersContainer.js'
import { pkgRoutes } from './routes.js'
import {
  useFollowAndBookMarkButtons,
  useLikeAndBookMarkButtons,
} from './social-actions/SocialButtons.js'

function useMainAppContext() {
  return useMemo<MainAppPluginHookResult>(() => ({ MainWrapper }), [])
}

function useAddBrowserMainColumnItemBase(browserMainColumnItemBase: BrowserMainColumnItemBase) {
  return <BrowserCollectionList {...useBrowseBookCollection()} {...browserMainColumnItemBase} />
}

registerAppRoutes(pkgRoutes)
registerMainAppPluginHook(useMainAppContext)

const menuDefaultSetting = { default: { Content: UsersContainer, Menu: UsersMenu } }
SettingsPagePlugins.register(function useSettingsPagePluregisterAddOn({ useSettingsSection }) {
  const addons = useMemo<PkgAddOns<SettingsSectionItem>>(() => menuDefaultSetting, [])
  useSettingsSection(addons)
})

HeaderPlugins.register(function useRegisterMainHeader({ useRightItems }) {
  const guestItems: PkgAddOns<HeaderAddonRegItem> = {
    loginButton: { Item: LoginButtonContainer },
    signupButton: { Item: SignupButtonContainer },
  }
  const authItems: PkgAddOns<HeaderAddonRegItem> = {
    addMenu: { Item: AddMenuContainer },
    avatarMenu: { Item: AvatarMenuContainer },
  }
  const rootItems: PkgAddOns<HeaderAddonRegItem> = {
    addMenu: null,
    avatarMenu: { Item: AvatarMenuContainer },
  }
  const addOns = useSwichAddonsWithAuth(guestItems, authItems, rootItems)
  useRightItems(addOns)
})

ResourcePagePlugins.register(function useResourcePage({
  useGeneralAction,
  useTopRightHeaderItems,
  resourceKey,
}) {
  const authItems = { addToCollectionButton: { Item: addResourceToCollectionButton } }
  const empityItems = { addToCollectionButton: null }
  const addOns = useSwichAddonsWithAuth(empityItems, authItems, empityItems)
  useGeneralAction(addOns)
  useTopRightHeaderItems(useLikeAndBookMarkButtons(resourceKey, 'resource'))
})

ResourceCardPlugins.register(({ useTopRightItems, resourceKey }) =>
  useTopRightItems(useLikeAndBookMarkButtons(resourceKey, 'resource')),
)

CollectionCardPlugins.register(({ collectionKey, useTopRightItems }) =>
  useTopRightItems(useFollowAndBookMarkButtons(collectionKey, 'collection')),
)

CollectionPagePlugins.register(({ useTopRightHeaderItems, collectionKey }) =>
  useTopRightHeaderItems(useFollowAndBookMarkButtons(collectionKey, 'collection')),
)

BookmarksPagePlugin.register(function useRegisterBookmarksPagePlugin({ useBrowserItems }) {
  const browserPluginItems = useMemo<PkgAddOns<BrowserPluginItem>>(() => {
    const addOnes = { Item: useAddBrowserMainColumnItemBase, filters: [], name: 'Collections' }
    return { collections: addOnes }
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
