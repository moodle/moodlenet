import type { MainAppPluginWrapper } from '@moodlenet/react-app/webapp'
import { AuthCtxProvider } from './context/AuthContext.js'

import { GeneralSettingsCtxProvider } from './context/GeneralSettingsCtxProvider.js'
import { MyProfileContextProvider } from './context/MyProfileContext.js'

const MainComponent: MainAppPluginWrapper = ({ children }) => {
  return (
    <GeneralSettingsCtxProvider>
      <AuthCtxProvider>
        <MyProfileContextProvider>{children}</MyProfileContextProvider>
      </AuthCtxProvider>
    </GeneralSettingsCtxProvider>
  )
}
export default MainComponent
