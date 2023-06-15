import type { MainAppPluginHookResult } from '@moodlenet/react-app/webapp'
import {
  registerAppRoutes,
  registerMainAppPluginHook,
  SearchPagePlugin,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import {
  SearchSubjectSectionAddon,
  SearchSubjectWrapperAddon,
} from '../components/organisms/BrowserSubjectList/SubjectSearchPageAddonHooks.js'
import MainWrapper from './MainWrapper.js'
import { pkgRoutes } from './routes.js'
import './shell.mjs'

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
  useSearchEntitySections(SearchSubjectSectionAddon)
  useWrappers(SearchSubjectWrapperAddon)
})
