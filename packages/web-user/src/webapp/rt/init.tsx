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
import { useSwichAddonsByAuth } from './init/AddonsByUserRule.js'
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

registerAppRoutes(pkgRoutes)
registerMainAppPluginHook(() => useMemo<MainAppPluginHookResult>(() => ({ MainWrapper }), []))

const menuAddonsHeaderButtons = {
  loginButton: { Item: LoginButtonContainer },
  signupButton: { Item: SignupButtonContainer },
  avatarMenu: { Item: AvatarMenuContainer },
  addMenu: { Item: AddMenuContainer },
}
const { loginButton, signupButton, avatarMenu, addMenu } = menuAddonsHeaderButtons
const _ = {
  guest: { loginButton, signupButton },
  auth: { addMenu, avatarMenu },
  root: { addMenu: null, avatarMenu },
}
HeaderPlugins.register(({ useRightItems }) => {
  const addons = useSwichAddonsByAuth(_)

  useRightItems(addons)
})

const menuAddonsDefaultSetting = { default: { Content: UsersContainer, Menu: UsersMenu } }
AdminSettingsPagePlugins.register(({ useAdminSettingsSection }) => {
  useAdminSettingsSection(menuAddonsDefaultSetting)
})

const authItems = { addToCollectionButton: { Item: addResourceToCollectionButton } }
const emptyItems = { addToCollectionButton: null }
const __ = { guest: emptyItems, root: emptyItems, auth: authItems }
ResourcePagePlugins.register(({ useGeneralAction, useTopRightHeaderItems, resourceKey }) => {
  const addons = useSwichAddonsByAuth(__)
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

function BrowserCollectionListItem(browserMainColumnItemBase: BrowserMainColumnItemBase) {
  return <BrowserCollectionList {...useBrowseBookCollection()} {...browserMainColumnItemBase} />
}

const bookmarksPageAddons = {
  collections: { Item: BrowserCollectionListItem, filters: [], name: 'Collections' },
}
BookmarksPagePlugin.register(({ useBrowserItems }) => {
  useBrowserItems(bookmarksPageAddons)
})
