import { BrowserCollectionList } from '@moodlenet/collection/ui'
import { CollectionCardPlugins, CollectionPagePlugins } from '@moodlenet/collection/webapp'
import { ResourceCardPlugins, ResourcePagePlugins } from '@moodlenet/ed-resource/webapp'
import type { BrowserMainColumnItemBase } from '@moodlenet/react-app/ui'
import {
  AdminSettingsPagePlugins,
  HeaderPlugins,
  registerAppRoutes,
  registerMainAppPluginHook,
  type MainAppPluginHookResult,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import { BookmarkButtonContainer, LikeButtonContainer } from './exports.mjs'
import { useSwichAddonsByAuth } from './lib/AddonsByUserRule.js'
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
import { SmallFollowButtonContainer } from './social-actions/SmallFollowButtonContainer.js'
import type { SocialActions, SocialActionsConfig } from './social-actions/SocialActions.js'
import { getUseSocialActions } from './social-actions/SocialActions.js'

const socialActions: SocialActions = {
  follow: SmallFollowButtonContainer,
  bookmark: BookmarkButtonContainer,
  like: LikeButtonContainer,
}

const addonsByEnity: SocialActionsConfig = {
  resource: ['bookmark', 'like'],
  collection: ['bookmark', 'follow'],
}
const { useSocialActions } = getUseSocialActions(socialActions, addonsByEnity)

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
  useTopRightHeaderItems(useSocialActions(resourceKey, 'resource'))
})

ResourceCardPlugins.register(({ useTopRightItems, resourceKey }) => {
  useTopRightItems(useSocialActions(resourceKey, 'resource'))
})

CollectionCardPlugins.register(({ collectionKey, useTopRightItems }) => {
  useTopRightItems(useSocialActions(collectionKey, 'collection'))
})

CollectionPagePlugins.register(({ useTopRightHeaderItems, collectionKey }) => {
  useTopRightHeaderItems(useSocialActions(collectionKey, 'collection'))
})

function BrowserCollectionLstItem(browserMainColumnItemBase: BrowserMainColumnItemBase) {
  return <BrowserCollectionList {...useBrowseBookCollection()} {...browserMainColumnItemBase} />
}

const bookmarksPageAddons = {
  collections: { Item: BrowserCollectionLstItem, filters: [], name: 'Collections' },
}
BookmarksPagePlugin.register(({ useBrowserItems }) => {
  useBrowserItems(bookmarksPageAddons)
})
