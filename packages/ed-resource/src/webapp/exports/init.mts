import { registerAppRoutes, registerMainAppPluginHook } from '@moodlenet/react-app/webapp'

import MainWrapper from '../MainWrapper.js'
import routes from '../routes.js'

registerAppRoutes({
  routes,
})
registerMainAppPluginHook(function useMainAppContext() {
  return {
    MainWrapper,
  }
})
