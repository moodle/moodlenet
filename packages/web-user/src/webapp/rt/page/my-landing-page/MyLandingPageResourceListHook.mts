import type { LandingResourceListProps } from '@moodlenet/ed-resource/ui'
import { ResourceContext, useResourceCardProps } from '@moodlenet/ed-resource/webapp'
import { href, searchPagePath } from '@moodlenet/react-app/common'
import { proxyWith } from '@moodlenet/react-app/ui'
import { silentCatchAbort } from '@moodlenet/react-app/webapp'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useMyProfileContext } from '../../context/MyProfileContext.js'

export function useMyLandingPageResourceListDataProps() {
  const resourceCtx = useContext(ResourceContext)
  const myProfileCtx = useMyProfileContext()
  const [resources, setResources] = useState<{ _key: string }[]>([])
  const myInterests = myProfileCtx?.myInterests
  useEffect(() => {
    resourceCtx
      .rpc('webapp/search', { rpcId: 'landing search collections' })(undefined, undefined, {
        limit: 8,
        ...(myInterests //?.isDefaultSearchFiltersEnabled
          ? {
              filterLanguages: myInterests?.current.languages.join('|'),
              filterLevels: myInterests?.current.levels.join('|'),
              filterLicenses: myInterests?.current.licenses.join('|'),
              filterSubjects: myInterests?.current.subjects.join('|'),
              sortType: 'Relevant',
            }
          : { sortType: 'Popular' }),
      })
      .then(_ => _.list)
      .then(setResources)
      .catch(silentCatchAbort)
  }, [resourceCtx, myInterests])
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

  const myProfileContext = useMyProfileContext()
  const hasSetInterests = !!myProfileContext?.myInterests.current
  const browserResourceListProps = useMemo<LandingResourceListProps>(() => {
    const props: LandingResourceListProps = {
      resourceCardPropsList,
      searchResourcesHref:
        myProfileContext?.myInterests.searchPageDefaults.href ?? href(searchPagePath()),
      hasSetInterests,
    }
    return props
  }, [
    myProfileContext?.myInterests.searchPageDefaults.href,
    resourceCardPropsList,
    hasSetInterests,
  ])

  return browserResourceListProps
}
