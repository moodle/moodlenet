import type { MainAppPluginHookResult } from '@moodlenet/react-app/webapp'
import { registerAppRoutes, registerMainAppPluginHook } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import '../shell.mjs'

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
