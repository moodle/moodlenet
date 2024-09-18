import type { MainAppPluginWrapper } from '@moodlenet/react-app/webapp'
import { AuthCtxProvider } from './context/AuthContext'

import { GeneralSettingsCtxProvider } from './context/GeneralSettingsCtxProvider'
import { MyProfileContextProvider } from './context/MyProfileContext'
import { ProfileContextProvider } from './context/ProfileContext'

const MainComponent: MainAppPluginWrapper = ({ children }) => {
  return (
    <GeneralSettingsCtxProvider>
      <AuthCtxProvider>
        <ProfileContextProvider>
          <MyProfileContextProvider>{children}</MyProfileContextProvider>
        </ProfileContextProvider>
      </AuthCtxProvider>
    </GeneralSettingsCtxProvider>
  )
}
export default MainComponent
