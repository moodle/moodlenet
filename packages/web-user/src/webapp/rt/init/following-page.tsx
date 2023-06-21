import { BrowserCollectionList } from '@moodlenet/collection/ui'
import type { BrowserMainColumnItemBase } from '@moodlenet/react-app/ui'
import { BrowserProfileList } from '@moodlenet/web-user/ui'
import { FollowingPagePlugin } from '../page/following/FollowingPageHook.mjs'
import { useMyFollowedBrowserCollectionListDataProps } from '../page/following/MyFollowingBrowserCollectionListHook.mjs'
import { useMyfollowedBrowserProfileListDataProps } from '../page/following/MyFollowingBrowserProfileListHook.mjs'

function BrowserProfileListItem(browserMainColumnItemBase: BrowserMainColumnItemBase) {
  return (
    <BrowserProfileList
      {...useMyfollowedBrowserProfileListDataProps()}
      {...browserMainColumnItemBase}
    />
  )
}
function BrowserCollectionListItem(browserMainColumnItemBase: BrowserMainColumnItemBase) {
  return (
    <BrowserCollectionList
      {...useMyFollowedBrowserCollectionListDataProps()}
      {...browserMainColumnItemBase}
    />
  )
}
const followingPageAddons = {
  collections: {
    Item: BrowserCollectionListItem,
    filters: [],
    name: 'Collections',
  },
  profiles: { Item: BrowserProfileListItem, filters: [], name: 'People', numElements: NaN },
}
FollowingPagePlugin.register(({ useBrowserItems }) => {
  useBrowserItems(followingPageAddons)
})
