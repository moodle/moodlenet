import { registerAppRoutes, registerMainAppPluginHook } from '@moodlenet/react-app/webapp'

import MainWrapper from '../MainWrapper.js'
import { pkgRoutes } from '../routes.js'

registerAppRoutes(pkgRoutes)
registerMainAppPluginHook(function useMainAppContext() {
  return {
    MainWrapper,
  }
})
