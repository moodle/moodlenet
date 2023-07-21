import { ResourcePagePlugins } from '@moodlenet/ed-resource/webapp'
import {
  registerAppRoutes,
  registerMainAppPluginHook,
  type MainAppPluginHookResult,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import { SendResourceToMoodleButton } from '../ui/components/SendResourceToMoodleButton.js'
//import './init/bookmark-page.js'

import { MainWrapper } from './MainWrapper.js'
import { pkgRoutes } from './routes.js'

registerAppRoutes(pkgRoutes)
registerMainAppPluginHook(() => useMemo<MainAppPluginHookResult>(() => ({ MainWrapper }), []))

ResourcePagePlugins.register(function useResourcePagePlugin() {
  return {
    generalAction: {
      sendToMoodle: {
        Item: SendResourceToMoodleButton,
      },
    },
  }
})
