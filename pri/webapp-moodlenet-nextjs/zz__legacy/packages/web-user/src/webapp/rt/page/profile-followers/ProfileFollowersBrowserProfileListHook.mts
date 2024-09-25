import { proxyWith } from '@moodlenet/react-app/ui'
import { silentCatchAbort } from '@moodlenet/react-app/webapp'
import { useEffect, useMemo, useState } from 'react'
import type { BrowserProfileListDataProps } from '../../../ui/exports/ui.mjs'
import { useProfileCardProps } from '../../organisms/ProfileCardHooks'
import { shell } from '../../shell.mjs'

export function useProfileFollowersBrowserProfileListDataProps({
  profileKey,
}: {
  profileKey: string
}) {
  const [result, setResult] = useState<{ profiles: { _key: string }[] }>({
    profiles: [],
  })

  useEffect(() => {
    shell.rpc
      .me(
        'webapp/feature-entity/profiles/:feature(follow|like)/:entityType(profile|collection|resource|subject)/:_key',
        { rpcId: `FollowersBrowserProfileListDataProps#${profileKey}` },
      )(
        undefined,
        { feature: 'follow', entityType: 'profile', _key: profileKey },
        { mode: 'reverse', limit: 100 },
      )
      .then(setResult)
      .catch(silentCatchAbort)
  }, [profileKey])
  const profilesCardPropsList = useMemo<BrowserProfileListDataProps['profilesCardPropsList']>(
    () =>
      result.profiles.map(({ _key }) => ({
        key: _key,
        props: proxyWith(function useBrowserProfileCardPropsList() {
          const props = useProfileCardProps(_key)
          return { props }
        }),
      })),
    [result],
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
