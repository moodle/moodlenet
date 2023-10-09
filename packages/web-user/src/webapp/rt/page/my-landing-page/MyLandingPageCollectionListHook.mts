import type { LandingCollectionListProps } from '@moodlenet/collection/ui'
import { CollectionContext, useCollectionCardProps } from '@moodlenet/collection/webapp'
import { href, searchPagePath } from '@moodlenet/react-app/common'
import { proxyWith } from '@moodlenet/react-app/ui'
import { silentCatchAbort } from '@moodlenet/react-app/webapp'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useMyProfileContext } from '../../context/MyProfileContext.js'

export function useMyLandingPageCollectionListDataProps() {
  const collectionCtx = useContext(CollectionContext)
  const [collections, setCollections] = useState<{ _key: string }[]>([])
  useEffect(() => {
    collectionCtx
      .rpc('webapp/search', { rpcId: 'landing search collections' })(null, null, { limit: 8 })
      .then(_ => _.list)
      .then(setCollections)
      .catch(silentCatchAbort)
  }, [collectionCtx])
  const collectionCardPropsList = useMemo<LandingCollectionListProps['collectionCardPropsList']>(
    () =>
      collections.map(({ _key }) => ({
        key: _key,
        props: proxyWith(function useMyLandingPageCollectionCardProps() {
          const props = useCollectionCardProps(_key)
          return { props }
        }),
      })),
    [collections],
  )

  const myProfileContext = useMyProfileContext()
  const hasSetInterests = !!myProfileContext?.myInterests.current
  const browserCollectionListProps = useMemo<LandingCollectionListProps>(() => {
    const props: LandingCollectionListProps = {
      collectionCardPropsList,
      searchCollectionsHref:
        myProfileContext?.myInterests.searchPageDefaults.href ?? href(searchPagePath()),
      hasSetInterests,
    }
    return props
  }, [
    collectionCardPropsList,
    hasSetInterests,
    myProfileContext?.myInterests.searchPageDefaults.href,
  ])

  return browserCollectionListProps
}
