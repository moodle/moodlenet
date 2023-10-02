import type { LandingResourceListProps } from '@moodlenet/ed-resource/ui'
import { useResourceCardProps } from '@moodlenet/ed-resource/webapp'
import { href, searchPagePath } from '@moodlenet/react-app/common'
import { proxyWith } from '@moodlenet/react-app/ui'
import { useContext, useEffect, useMemo, useState } from 'react'
import { MyProfileContext } from '../../context/MyProfileContext.js'
import { shell } from '../../shell.mjs'

export function useMyLandingPageResourceListDataProps() {
  const [resources, setResources] = useState<{ _key: string }[]>([])
  const myProfileContext = useContext(MyProfileContext)
  useEffect(() => {
    shell.rpc
      .me('webapp/landing/get-list/:entityType(collections|resources|profiles)')(
        undefined,
        {
          entityType: 'resources',
        },
        { limit: 8 },
      )
      .then(setResources)
  }, [])
  const resourceCardPropsList = useMemo<LandingResourceListProps['resourceCardPropsList']>(
    () =>
      resources.map(({ _key }) => ({
        key: _key,
        props: proxyWith(function useMyLandingPageResourceCardProps() {
          const props = useResourceCardProps(_key)
          return { props }
        }),
      })),
    [resources],
  )

  const browserResourceListProps = useMemo<LandingResourceListProps>(() => {
    const props: LandingResourceListProps = {
      resourceCardPropsList,
      searchResourcesHref:
        myProfileContext?.myInterests.searchPageDefaults.href ?? href(searchPagePath()),
    }
    return props
  }, [myProfileContext?.myInterests.searchPageDefaults.href, resourceCardPropsList])

  return browserResourceListProps
}
