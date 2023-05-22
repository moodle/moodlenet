import type { BrowserCollectionListProps } from '@moodlenet/collection/ui'
import { useCollectionCardProps } from '@moodlenet/collection/webapp'
import type { BrowserMainColumnItemBase } from '@moodlenet/react-app/ui'
import { proxyWith } from '@moodlenet/react-app/ui'
import { useMemo } from 'react'
import { useMyProfileContext } from '../../../MyProfile/MyProfileContext.js'

export function useMyBookmarkedBrowserCollectionListProps(
  browserMainColumnItemBase: BrowserMainColumnItemBase,
) {
  const bookmarkedCollections = useMyProfileContext()?.myFeaturedEntities.all.bookmark.collection
  console.log({ myProfileCtx: useMyProfileContext() })
  const browserCollectionListProps = useMemo<BrowserCollectionListProps>(() => {
    const props: BrowserCollectionListProps = {
      collectionCardPropsList: (bookmarkedCollections ?? []).map(({ _key }) => ({
        key: _key,
        props: proxyWith(function useBrowserCollectionCardPropsList() {
          const props = useCollectionCardProps(_key)
          return { props }
        }),
      })),
      loadMore: null,
      ...browserMainColumnItemBase,
    }
    return props
  }, [browserMainColumnItemBase, bookmarkedCollections])

  return browserCollectionListProps
}
