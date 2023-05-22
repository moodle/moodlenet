import type { BrowserCollectionListDataProps } from '@moodlenet/collection/ui'
import { useCollectionCardProps } from '@moodlenet/collection/webapp'
import { proxyWith } from '@moodlenet/react-app/ui'
import { useMemo } from 'react'
import { useMyProfileContext } from '../../context/MyProfileContext.js'

export function useMyBookmarkedBrowserCollectionListDataProps() {
  const bookmarkedCollections = useMyProfileContext()?.myFeaturedEntities.all.bookmark.collection

  const collectionCardPropsList = useMemo<
    BrowserCollectionListDataProps['collectionCardPropsList']
  >(
    () =>
      (bookmarkedCollections ?? []).map(({ _key }) => ({
        key: _key,
        props: proxyWith(function useBrowserCollectionCardPropsList() {
          const props = useCollectionCardProps(_key)
          return { props }
        }),
      })),
    [bookmarkedCollections],
  )

  const browserCollectionListProps = useMemo<BrowserCollectionListDataProps>(() => {
    const props: BrowserCollectionListDataProps = {
      collectionCardPropsList,
      loadMore: null,
    }
    return props
  }, [collectionCardPropsList])

  return browserCollectionListProps
}
