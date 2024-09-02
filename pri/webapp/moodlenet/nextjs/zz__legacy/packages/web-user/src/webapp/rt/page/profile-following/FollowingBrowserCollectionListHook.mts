import type { BrowserCollectionListDataProps } from '@moodlenet/collection/ui'
import { useCollectionCardProps } from '@moodlenet/collection/webapp'
import { proxyWith } from '@moodlenet/react-app/ui'
import { silentCatchAbort } from '@moodlenet/react-app/webapp'
import { useEffect, useMemo, useState } from 'react'
import { useMyProfileContext } from '../../context/MyProfileContext.js'
import { shell } from '../../shell.mjs'

export function useFollowingBrowserCollectionListDataProps({ profileKey }: { profileKey: string }) {
  const myCtx = useMyProfileContext()
  const isMe = myCtx?.myProfile._key === profileKey
  const [followingCollections, setFollowingCollections] = useState(
    isMe ? myCtx.myFeaturedEntities.all.follow.profile : [],
  )

  useEffect(() => {
    if (isMe) return
    shell.rpc
      .me(
        'webapp/feature-entity/profiles/:feature(follow|like)/:entityType(profile|collection|resource|subject)/:_key',
        { rpcId: `FollowingBrowserCollectionsListDataProps#${profileKey}` },
      )(undefined, { _key: profileKey, feature: 'follow', entityType: 'collection' }, {})
      .then(_ => setFollowingCollections(_.profiles))
      .catch(silentCatchAbort)
  }, [isMe, profileKey])

  const collectionCardPropsList = useMemo<
    BrowserCollectionListDataProps['collectionCardPropsList']
  >(
    () =>
      followingCollections.map(({ _key }) => ({
        key: _key,
        props: proxyWith(function useBrowserCollectionCardPropsList() {
          const props = useCollectionCardProps(_key)
          return { props }
        }),
      })),
    [followingCollections],
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
