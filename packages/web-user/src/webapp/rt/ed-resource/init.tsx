import { SubjectCardPlugins, SubjectPagePlugins } from '@moodlenet/ed-meta/webapp'
import '@moodlenet/ed-resource/ui'
import { registerAppRoutes, SearchPagePlugin } from '@moodlenet/react-app/webapp'
import { useEffect, useMemo, useState } from 'react'

import type { PluginHookResult } from '@moodlenet/core/lib'
import type { ResourceCardProps } from '@moodlenet/ed-resource/ui'
import {
  pkgRoutes,
  SearchResourceSectionAddon,
  SearchResourceWrapperAddon,
  SimpleResourceList,
  useResourceCardProps,
} from '@moodlenet/ed-resource/ui'
import { proxyWith } from '@moodlenet/react-app/ui'
import { FilterNone } from '@mui/icons-material'
import { shell } from '../shell.mjs'

registerAppRoutes(pkgRoutes)
// registerMainAppPluginHook(function useMainAppContext() {
//   const mainAppPlugin = useMemo<MainAppPluginHookResult>(
//     () => ({
//       MainWrapper,
//     }),
//     [],
//   )
//   return mainAppPlugin
// })

SearchPagePlugin.register(() => {
  return {
    searchEntitySections: SearchResourceSectionAddon,
    wrappers: SearchResourceWrapperAddon,
  }
})

SubjectCardPlugins.register(({ subjectKey }) => {
  const { numResources } = useSubjectResourceCount(subjectKey)
  return {
    overallItems: {
      numResources: { name: 'Resources', value: numResources, Icon: <FilterNone /> },
    },
  }
})

function useSubjectResourceCount(subjectKey: string) {
  const [numResources, setNumResources] = useState(0)
  useEffect(() => {
    shell.rpc
      .me('webapp/get-resources-count-in-subject/:subjectKey')(null, { subjectKey })
      .then(res => setNumResources(res.count))
  }, [subjectKey])
  return { numResources }
}
SubjectPagePlugins.register(({ subjectKey }) => {
  const { numResources } = useSubjectResourceCount(subjectKey)
  const list = useMemo(
    () =>
      function MainColumnResourceList() {
        return <SubjectPageSimpleResourceList subjectKey={subjectKey} />
      },
    [subjectKey],
  )
  return useMemo<PluginHookResult<typeof SubjectPagePlugins>>(
    () => ({
      mainColumnItems: {
        resources: { Item: list },
      },
      overallItems: {
        numResources: { name: 'Resources', value: numResources },
      },
    }),
    [list, numResources],
  )
})
function SubjectPageSimpleResourceList({ subjectKey }: { subjectKey: string }) {
  const [resourceKeys, setResourceKeys] = useState<{ _key: string }[]>([])
  useEffect(() => {
    shell.rpc
      .me('webapp/search')(undefined, undefined, {
        sortType: 'Recent',
        limit: 50,
        filterSubjects: subjectKey,
      })
      .then(res => {
        setResourceKeys(res.list)
      })
  }, [subjectKey])
  const resourceCardPropsList = resourceKeys.map(({ _key }) => {
    const props = proxyWith<ResourceCardProps>(function useResourceCardProxy() {
      const props = useResourceCardProps(_key)
      return { props }
    })
    return {
      key: _key,
      props,
    }
  })
  return (
    <SimpleResourceList
      resourceCardPropsList={resourceCardPropsList}
      key={subjectKey}
      title="Resources"
    />
  )
}
