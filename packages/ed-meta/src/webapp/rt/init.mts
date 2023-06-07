import type { MainAppPluginHookResult } from '@moodlenet/react-app/webapp'
import { registerMainAppPluginHook } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import MainWrapper from './MainWrapper.js'
import './shell.mjs'

// registerAppRoutes(pkgRoutes)
registerMainAppPluginHook(function useMainAppContext() {
  const mainAppPlugin = useMemo<MainAppPluginHookResult>(
    () => ({
      MainWrapper,
    }),
    [],
  )
  return mainAppPlugin
})
