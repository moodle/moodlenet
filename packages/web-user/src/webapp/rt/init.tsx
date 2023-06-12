import { BrowserCollectionList, LandingCollectionList } from '@moodlenet/collection/ui'
import { CollectionCardPlugins, CollectionPagePlugins } from '@moodlenet/collection/webapp'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import { LandingResourceList } from '@moodlenet/ed-resource/ui'
import { ResourceCardPlugins, ResourcePagePlugins } from '@moodlenet/ed-resource/webapp'
import type { BrowserMainColumnItemBase } from '@moodlenet/react-app/ui'
import type { PkgAddOns } from '@moodlenet/react-app/webapp'
import {
  AdminSettingsPagePlugins,
  HeaderPlugins,
  LandingHookPlugin,
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
import { useMyLandingPageCollectionListDataProps } from './page/my-landing-page/MyLandingPageCollectionListHook.mjs'
import { useMyLandingPageResourceListDataProps } from './page/my-landing-page/MyLandingPageResourceListHook.mjs'
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

const landingPageMainColumnItems: PkgAddOns<AddonItemNoKey> = {
  resourceList: {
    Item: () => {
      const props = useMyLandingPageResourceListDataProps()
      return <LandingResourceList {...props} />
    },
  },
  collectionList: {
    Item: () => {
      const props = useMyLandingPageCollectionListDataProps()
      return <LandingCollectionList {...props} />
    },
  },
}
LandingHookPlugin.register(function useLandingPagePlugin({ useMainColumnItems }) {
  useMainColumnItems(landingPageMainColumnItems)
})

HeaderPlugins.register(() => ({
  rightItems: useSwichAddonsByAuth(menuHeaderButtonsAuthAddons),
}))

AdminSettingsPagePlugins.register(({ useAdminSettingsSection }) =>
  useAdminSettingsSection(menuAddonsDefaultSetting),
)

ResourcePagePlugins.register(({ useGeneralAction, useTopRightHeaderItems, resourceKey }) => {
  useGeneralAction(useSwichAddonsByAuth(resourcePageAddonsByAuth))
  useTopRightHeaderItems(useSocialActions(resourceKey, 'resource'))
})

ResourceCardPlugins.register(({ useBottomRightItems, resourceKey }) => {
  useBottomRightItems(useSocialActions(resourceKey, 'resource'))
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
