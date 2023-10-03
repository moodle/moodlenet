import type { LandingCollectionListProps } from '@moodlenet/collection/ui'
import { useCollectionCardProps } from '@moodlenet/collection/webapp'
import { href, searchPagePath } from '@moodlenet/react-app/common'
import { proxyWith } from '@moodlenet/react-app/ui'
import { useEffect, useMemo, useState } from 'react'
import { useMyProfileContext } from '../../context/MyProfileContext.js'
import { shell } from '../../shell.mjs'

export function useMyLandingPageCollectionListDataProps() {
  const [collections, setCollections] = useState<{ _key: string }[]>([])
  useEffect(() => {
    shell.rpc
      .me('webapp/landing/get-list/:entityType(collections|resources|profiles)')(
        undefined,
        {
          entityType: 'collections',
        },
        { limit: 12 },
      )
      .then(setCollections)
  }, [])
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
