import { BrowserCollectionList } from '@moodlenet/collection/ui'
import type { BrowserMainColumnItemBase } from '@moodlenet/react-app/ui'
import { BrowserProfileList } from '@moodlenet/web-user/ui'
import { useMemo } from 'react'
import { useFollowingBrowserCollectionListDataProps } from '../page/profile-following/FollowingBrowserCollectionListHook.mjs'
import { useFollowingBrowserProfileListDataProps } from '../page/profile-following/FollowingBrowserProfileListHook.mjs'
import { FollowingPagePlugin } from '../page/profile-following/ProfileFollowingPageHook.mjs'

FollowingPagePlugin.register(function useFollowingPagePlugin({ profileKey }) {
  return useMemo(() => {
    const browserItems = {
      collections: {
        Item: BrowserCollectionListItem,
        filters: [],
        name: 'Collections',
      },
      profiles: { Item: BrowserProfileListItem, filters: [], name: 'People', numElements: NaN },
    }
    return {
      browserItems,
    }
    function BrowserProfileListItem(browserMainColumnItemBase: BrowserMainColumnItemBase) {
      return (
        <BrowserProfileList
          {...useFollowingBrowserProfileListDataProps({ profileKey })}
          {...browserMainColumnItemBase}
        />
      )
    }
    function BrowserCollectionListItem(browserMainColumnItemBase: BrowserMainColumnItemBase) {
      return (
        <BrowserCollectionList
          {...useFollowingBrowserCollectionListDataProps({ profileKey })}
          {...browserMainColumnItemBase}
        />
      )
    }
  }, [profileKey])
})
