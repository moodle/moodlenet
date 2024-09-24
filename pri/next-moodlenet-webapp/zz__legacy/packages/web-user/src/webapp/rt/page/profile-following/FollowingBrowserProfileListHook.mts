import { proxyWith } from '@moodlenet/react-app/ui'
import { silentCatchAbort } from '@moodlenet/react-app/webapp'
import { useEffect, useMemo, useState } from 'react'
import type { BrowserProfileListDataProps } from '../../../ui/exports/ui.mjs'
import { useMyProfileContext } from '../../context/MyProfileContext'
import { useProfileCardProps } from '../../organisms/ProfileCardHooks'
import { shell } from '../../shell.mjs'

export function useFollowingBrowserProfileListDataProps({ profileKey }: { profileKey: string }) {
  const myCtx = useMyProfileContext()
  const isMe = myCtx?.myProfile._key === profileKey
  const [followingProfiles, setFollowingProfiles] = useState(
    isMe ? myCtx.myFeaturedEntities.all.follow.profile : [],
  )

  useEffect(() => {
    if (isMe) return
    shell.rpc
      .me(
        'webapp/feature-entity/profiles/:feature(follow|like)/:entityType(profile|collection|resource|subject)/:_key',
        { rpcId: `FollowingBrowserProfileListDataProps#${profileKey}` },
      )(undefined, { _key: profileKey, feature: 'follow', entityType: 'profile' }, { limit: 100 })
      .then(_ => setFollowingProfiles(_.profiles))
      .catch(silentCatchAbort)
  }, [isMe, profileKey])

  const profilesCardPropsList = useMemo<BrowserProfileListDataProps['profilesCardPropsList']>(
    () =>
      followingProfiles.map(({ _key }) => ({
        key: _key,
        props: proxyWith(function useBrowserProfileCardPropsList() {
          const props = useProfileCardProps(_key)
          return { props }
        }),
      })),
    [followingProfiles],
  )

  const browserProfileListProps = useMemo<BrowserProfileListDataProps>(() => {
    const props: BrowserProfileListDataProps = {
      profilesCardPropsList,
      loadMore: null,
    }
    return props
  }, [profilesCardPropsList])

  return browserProfileListProps
}
