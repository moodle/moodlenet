import { BrowserCollectionList } from '@moodlenet/collection/ui'
import { BrowserResourceList } from '@moodlenet/ed-resource/ui'
import type { BrowserMainColumnItemBase } from '@moodlenet/react-app/ui'
import { BookmarksPagePlugin } from '../page/bookmarks/BookmarksPageHook.mjs'
import { useMyBookmarkedBrowserCollectionListDataProps } from '../page/bookmarks/MyBookmarkedBrowserCollectionListHook.mjs'
import { useMyBookmarkedBrowserResourceListDataProps } from '../page/bookmarks/MyBookmarkedBrowserResourceListHook.mjs'

function BrowserCollectionListItem(browserMainColumnItemBase: BrowserMainColumnItemBase) {
  return (
    <BrowserCollectionList
      {...useMyBookmarkedBrowserCollectionListDataProps()}
      {...browserMainColumnItemBase}
    />
  )
}
function BrowserResourceListItem(browserMainColumnItemBase: BrowserMainColumnItemBase) {
  return (
    <BrowserResourceList
      {...useMyBookmarkedBrowserResourceListDataProps()}
      {...browserMainColumnItemBase}
    />
  )
}
const bookmarksPageAddons = {
  collections: {
    Item: BrowserCollectionListItem,
    filters: [],
    name: 'Collections',
  },
  resources: { Item: BrowserResourceListItem, filters: [], name: 'Resources', numElements: NaN },
}
BookmarksPagePlugin.register(({ useBrowserItems }) => {
  useBrowserItems(bookmarksPageAddons)
})
