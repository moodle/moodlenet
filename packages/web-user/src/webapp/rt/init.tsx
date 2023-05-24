import {
  AddToCollectionButtonByResourceContextContainer as addResourceToCollectionButton,
  CollectionCardPlugins,
  CollectionPagePlugins,
} from '@moodlenet/collection/webapp'
import { ResourceCardPlugins, ResourcePagePlugins } from '@moodlenet/ed-resource/webapp'
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
import { useSwichAddonsByAuth } from './context/AuthContext.js'
import MainWrapper from './MainWrapper.js'
import { AddMenuContainer } from './menus/AddMenuContainer.js'
import { AvatarMenuContainer } from './menus/AvatarMenuContainer.js'
import { LoginButtonContainer, SignupButtonContainer } from './page/access/AccessContainers.js'
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

const menuAddonsHeaderButtons = {
  loginButton: { Item: LoginButtonContainer },
  signupButton: { Item: SignupButtonContainer },
  avatarMenu: { Item: AvatarMenuContainer },
  addMenu: { Item: AddMenuContainer },
}

HeaderPlugins.register(function useRegisterMainHeader({ useRightItems }) {
  const { loginButton, signupButton, avatarMenu, addMenu } = menuAddonsHeaderButtons
  const addons = useSwichAddonsByAuth({
    guest: { loginButton, signupButton },
    auth: { addMenu, avatarMenu },
    root: { addMenu: null, avatarMenu },
  })

  useRightItems(addons)
})

const menuAddonsDefaultSetting = { default: { Content: UsersContainer, Menu: UsersMenu } }
AdminSettingsPagePlugins.register(function useSettingsPagePluregisterAddOn({
  useAdminSettingsSection,
}) {
  const addons = useMemo(() => menuAddonsDefaultSetting, [])
  useAdminSettingsSection(addons)
})

ResourcePagePlugins.register(function useResourcePage({
  useGeneralAction,
  useTopRightHeaderItems,
  resourceKey,
}) {
  const authItems = { addToCollectionButton: { Item: addResourceToCollectionButton } }
  const emptyItems = { addToCollectionButton: null }

  const addons = useSwichAddonsByAuth({ guest: emptyItems, root: emptyItems, auth: authItems })
  useGeneralAction(addons)
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
  const browserPluginItems = useMemo(() => {
    const addones = { Item: useAddBrowserMainColumnItemBase, filters: [], name: 'Collections' }
    return { collections: addones }
  }, [])

  useBrowserItems(browserPluginItems)
})
