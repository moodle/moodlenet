import { SubjectCardPlugins, SubjectPagePlugins } from '@moodlenet/ed-meta/webapp'
import type { MainAppPluginHookResult } from '@moodlenet/react-app/webapp'
import {
  registerAppRoutes,
  registerMainAppPluginHook,
  SearchPagePlugin,
} from '@moodlenet/react-app/webapp'
import { useEffect, useMemo, useState } from 'react'
import '../shell.mjs'

import { FilterNone } from '@material-ui/icons'
import type { PluginHookResult } from '@moodlenet/core/lib'
import { proxyWith } from '@moodlenet/react-app/ui'
import {
  SearchResourceSectionAddon,
  SearchResourceWrapperAddon,
} from '../components/organisms/lists/BrowserResourceList/ResourceSearchPageAddonHooks.js'
import MainWrapper from '../MainWrapper.js'
import { pkgRoutes } from '../routes.js'
import { shell } from '../shell.mjs'
import type { ResourceCardProps } from './ui.mjs'
import { SimpleResourceList } from './ui.mjs'
import { useResourceCardProps } from './webapp.mjs'

registerAppRoutes(pkgRoutes)
registerMainAppPluginHook(function useMainAppContext() {
  const mainAppPlugin = useMemo<MainAppPluginHookResult>(
    () => ({
      MainWrapper,
    }),
    [],
  )
  return mainAppPlugin
})

SearchPagePlugin.register(({ useSearchEntitySections, useWrappers }) => {
  useSearchEntitySections(SearchResourceSectionAddon)
  useWrappers(SearchResourceWrapperAddon)
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
    shell.rpc.me['webapp/get-resources-count-in-subject/:subjectKey'](null, { subjectKey }).then(
      res => setNumResources(res.count),
    )
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
    shell.rpc.me['webapp/search']({ filters: [['subject', subjectKey]] }, undefined, {
      sortType: 'Recent',
      limit: 50,
    }).then(res => {
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
