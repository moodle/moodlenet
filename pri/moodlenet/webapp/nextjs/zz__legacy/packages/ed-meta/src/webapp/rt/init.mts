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
} from '../components/organisms/BrowserSubjectList/SubjectSearchPageAddonHooks'
import MainWrapper from './MainWrapper'
import { pkgRoutes } from './routes'
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

SearchPagePlugin.register(() => {
  return {
    searchEntitySections: SearchSubjectSectionAddon,
    wrappers: SearchSubjectWrapperAddon,
  }
})
