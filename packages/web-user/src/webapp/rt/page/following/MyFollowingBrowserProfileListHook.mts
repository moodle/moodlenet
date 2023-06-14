import { proxyWith } from '@moodlenet/react-app/ui'
import { useMemo } from 'react'
import type { BrowserProfileListDataProps } from '../../../ui/exports/ui.mjs'
import { useMyProfileContext } from '../../context/MyProfileContext.js'
import { useProfileCardProps } from '../../organisms/ProfileCardHooks.js'

export function useMyfollowedBrowserProfileListDataProps() {
  const followedProfiles = useMyProfileContext()?.myFeaturedEntities.all.follow.profile

  const profilesCardPropsList = useMemo<BrowserProfileListDataProps['profilesCardPropsList']>(
    () =>
      (followedProfiles ?? []).map(({ _key }) => ({
        key: _key,
        props: proxyWith(function useBrowserProfileCardPropsList() {
          const props = useProfileCardProps(_key)
          return { props }
        }),
      })),
    [followedProfiles],
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
