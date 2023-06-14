import type { BrowserCollectionListDataProps } from '@moodlenet/collection/ui'
import { useCollectionCardProps } from '@moodlenet/collection/webapp'
import { proxyWith } from '@moodlenet/react-app/ui'
import { useMemo } from 'react'
import { useMyProfileContext } from '../../context/MyProfileContext.js'

export function useMyFollowedBrowserCollectionListDataProps() {
  const followedCollections = useMyProfileContext()?.myFeaturedEntities.all.follow.collection

  const collectionCardPropsList = useMemo<
    BrowserCollectionListDataProps['collectionCardPropsList']
  >(
    () =>
      (followedCollections ?? []).map(({ _key }) => ({
        key: _key,
        props: proxyWith(function useBrowserCollectionCardPropsList() {
          const props = useCollectionCardProps(_key)
          return { props }
        }),
      })),
    [followedCollections],
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
