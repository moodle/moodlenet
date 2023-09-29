import type { LandingResourceListProps } from '@moodlenet/ed-resource/ui'
import { useResourceCardProps, useResourceSearchQuery } from '@moodlenet/ed-resource/webapp'
import { href, searchPagePath } from '@moodlenet/react-app/common'
import { proxyWith } from '@moodlenet/react-app/ui'
import { useContext, useEffect, useMemo, useState } from 'react'
import { MyProfileContext } from '../../context/MyProfileContext.js'
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
  const myProfileContext = useContext(MyProfileContext)
  const [, , qStr, { ls2str }] = useResourceSearchQuery()
  const myCurrentInterests = myProfileContext?.myInterests.current
  const searchPageQueryString = !myCurrentInterests?.useAsDefaultSearchFilter
    ? undefined
    : qStr({
        languages: ls2str(myCurrentInterests.languages),
        levels: ls2str(myCurrentInterests.levels),
        licenses: ls2str(myCurrentInterests.licenses),
        subjects: ls2str(myCurrentInterests.subjects),
      }).qString
  const browserResourceListProps = useMemo<LandingResourceListProps>(() => {
    const props: LandingResourceListProps = {
      resourceCardPropsList,
      searchResourcesHref: href(searchPagePath({ q: searchPageQueryString })),
    }
    return props
  }, [resourceCardPropsList, searchPageQueryString])

  return browserResourceListProps
}
