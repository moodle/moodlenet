import { ResourcePagePlugins } from '@moodlenet/ed-resource/webapp'
import {
  registerAppRoutes,
  registerMainAppPluginHook,
  type MainAppPluginHookResult,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import { SendToMoodleContainer } from './components/SendToMoodleContainer'
import './shell.mjs'

import { MainWrapper } from './MainWrapper'
import { pkgRoutes } from './routes'

registerAppRoutes(pkgRoutes)
registerMainAppPluginHook(() => useMemo<MainAppPluginHookResult>(() => ({ MainWrapper }), []))

ResourcePagePlugins.register(function useResourcePagePlugin({ resourceCommonProps }) {
  return useMemo(
    () => ({
      generalAction: {
        sendToMoodle: resourceCommonProps
          ? {
              Item: SendToMoodleContainer,
              position: 1,
            }
          : undefined,
      },
    }),
    [resourceCommonProps],
  )
})
