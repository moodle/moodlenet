import type { LandingResourceListProps } from '@moodlenet/ed-resource/ui'
import { useResourceCardProps } from '@moodlenet/ed-resource/webapp'
import { href } from '@moodlenet/react-app/common'
import { proxyWith } from '@moodlenet/react-app/ui'
import { useEffect, useMemo, useState } from 'react'
import { shell } from '../../shell.mjs'

export function useMyLandingPageResourceListDataProps() {
  const [resources, setResources] = useState<{ _key: string }[]>([])

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
      searchResourcesHref: href('#'),
    }
    return props
  }, [resourceCardPropsList])

  return browserResourceListProps
}
