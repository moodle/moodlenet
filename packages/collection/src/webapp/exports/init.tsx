import type { MainAppPluginHookResult } from '@moodlenet/react-app/webapp'
import {
  registerAppRoutes,
  registerMainAppPluginHook,
  SearchPagePlugin,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import '../shell.mjs'

import {
  SearchCollectionSectionAddon,
  SearchCollectionWrapperAddon,
} from '../components/organisms/lists/BrowserCollectionList/CollectionSearchPageAddonHooks.js'
import MainWrapper from '../MainWrapper.js'
import { pkgRoutes } from '../routes.js'

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

SearchPagePlugin.register(() => {
  return {
    searchEntitySections: SearchCollectionSectionAddon,
    wrappers: SearchCollectionWrapperAddon,
  }
})
