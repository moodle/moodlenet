import { BrowserCollectionList } from '@moodlenet/collection/ui'
import { CollectionCardPlugins, CollectionPagePlugins } from '@moodlenet/collection/webapp'
import { ResourceCardPlugins, ResourcePagePlugins } from '@moodlenet/ed-resource/webapp'
import type { BrowserMainColumnItemBase } from '@moodlenet/react-app/ui'
import {
  HeaderPlugins,
  registerAppRoutes,
  registerMainAppPluginHook,
  type MainAppPluginHookResult,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import { useSwichAddonsByAuth } from './init/AddonsByUserRule.js'
import MainWrapper from './MainWrapper.js'
import {
  menuAddonsDefaultSetting,
  menuHeaderButtonsAuthAddons,
  resourcePageAddonsByAuth,
} from './menus/menuAddons.js'
import { BookmarksPagePlugin } from './page/bookmarks/BookmarksPageHook.mjs'
import { useMyBookmarkedBrowserCollectionListDataProps as useBrowseBookCollection } from './page/bookmarks/MyBookmarkedBrowserCollectionListHook.mjs'
import { pkgRoutes } from './routes.js'
import './shell.mjs'
import {
  useFollowAndBookMarkButtons,
  useLikeAndBookMarkButtons,
} from './social-actions/SocialButtons.js'

registerAppRoutes(pkgRoutes)
registerMainAppPluginHook(() => useMemo<MainAppPluginHookResult>(() => ({ MainWrapper }), []))

HeaderPlugins.register(({ useRightItems }) =>
  useRightItems(useSwichAddonsByAuth(menuHeaderButtonsAuthAddons)),
)

AdminSettingsPagePlugins.register(({ useAdminSettingsSection }) =>
  useAdminSettingsSection(menuAddonsDefaultSetting),
)

ResourcePagePlugins.register(({ useGeneralAction, useTopRightHeaderItems, resourceKey }) => {
  useGeneralAction(useSwichAddonsByAuth(resourcePageAddonsByAuth))
  useTopRightHeaderItems(useLikeAndBookMarkButtons(resourceKey, 'resource'))
})

ResourceCardPlugins.register(({ useTopRightItems, resourceKey }) => {
  useTopRightItems(useLikeAndBookMarkButtons(resourceKey, 'resource'))
})

CollectionCardPlugins.register(({ collectionKey, useTopRightItems }) => {
  useTopRightItems(useFollowAndBookMarkButtons(collectionKey, 'collection'))
})

CollectionPagePlugins.register(({ useTopRightHeaderItems, collectionKey }) => {
  useTopRightHeaderItems(useFollowAndBookMarkButtons(collectionKey, 'collection'))
})

function BrowserCollectionListItem(browserMainColumnItemBase: BrowserMainColumnItemBase) {
  return <BrowserCollectionList {...useBrowseBookCollection()} {...browserMainColumnItemBase} />
}

const bookmarksPageAddons = {
  collections: { Item: BrowserCollectionListItem, filters: [], name: 'Collections' },
}
BookmarksPagePlugin.register(({ useBrowserItems }) => {
  useBrowserItems(bookmarksPageAddons)
})
