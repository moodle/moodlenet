import { href, searchPagePath } from '@moodlenet/react-app/common'
import { proxyWith } from '@moodlenet/react-app/ui'
import { useEffect, useMemo, useState } from 'react'
import type { LandingProfileListProps } from '../../../ui/exports/ui.mjs'
import { useMyProfileContext } from '../../exports.mjs'
import { useProfileCardProps } from '../../organisms/ProfileCardHooks.js'
import { shell } from '../../shell.mjs'

export function useMyLandingPageProfileListDataProps() {
  const [profiles, setProfiles] = useState<{ _key: string }[]>([])

  useEffect(() => {
    shell.rpc
      .me('webapp/landing/get-list/:entityType(collections|resources|profiles)')(
        undefined,
        {
          entityType: 'profiles',
        },
        { limit: 10 },
      )
      .then(setProfiles)
  }, [])
  const profilesPropsList = useMemo<LandingProfileListProps['profilesPropsList']>(
    () =>
      profiles.map(({ _key }) => ({
        key: _key,
        props: proxyWith(function useMyLandingPageProfileCardProps() {
          const props = useProfileCardProps(_key)
          return { props }
        }),
      })),
    [profiles],
  )

  const myProfileContext = useMyProfileContext()
  const hasSetInterests = !!myProfileContext?.myInterests.current
  const browserProfileListProps = useMemo<LandingProfileListProps>(() => {
    const props: LandingProfileListProps = {
      profilesPropsList,
      searchAuthorsHref:
        myProfileContext?.myInterests.searchPageDefaults.href ?? href(searchPagePath()),
      hasSetInterests,
    }
    return props
  }, [profilesPropsList, myProfileContext?.myInterests.searchPageDefaults.href, hasSetInterests])

  return browserProfileListProps
}
