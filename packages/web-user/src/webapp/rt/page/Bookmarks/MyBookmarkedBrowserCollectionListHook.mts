import type { BrowserCollectionListDataProps } from '@moodlenet/collection/ui'
import { useCollectionCardProps } from '@moodlenet/collection/webapp'
import { proxyWith } from '@moodlenet/react-app/ui'
import { useMemo } from 'react'
import { useMyProfileContext } from '../../../MyProfile/MyProfileContext.js'

export function useMyBookmarkedBrowserCollectionListDataProps() {
  const bookmarkedCollections = useMyProfileContext()?.myFeaturedEntities.all.bookmark.collection
  const browserCollectionListProps = useMemo<BrowserCollectionListDataProps>(() => {
    const props: BrowserCollectionListDataProps = {
      collectionCardPropsList: (bookmarkedCollections ?? []).map(({ _key }) => ({
        key: _key,
        props: proxyWith(function useBrowserCollectionCardPropsList() {
          const props = useCollectionCardProps(_key)
          return { props }
        }),
      })),
      loadMore: null,
    }
    return props
  }, [bookmarkedCollections])

  return browserCollectionListProps
}
