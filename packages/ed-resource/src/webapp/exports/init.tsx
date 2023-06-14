import { SubjectPagePlugins } from '@moodlenet/ed-meta/webapp'
import type { MainAppPluginHookResult } from '@moodlenet/react-app/webapp'
import {
  registerAppRoutes,
  registerMainAppPluginHook,
  SearchPagePlugin,
} from '@moodlenet/react-app/webapp'
import { useEffect, useMemo, useState } from 'react'
import '../shell.mjs'

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

SubjectPagePlugins.register(({ subjectKey }) => {
  return useMemo(
    () => ({
      mainColumnItems: {
        resources: { Item: () => <SubjectPageSimpleResourceList subjectKey={subjectKey} /> },
      },
    }),
    [subjectKey],
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
