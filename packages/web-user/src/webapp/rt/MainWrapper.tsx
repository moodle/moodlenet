import type { MainAppPluginWrapper } from '@moodlenet/react-app/webapp'
import { AuthCtxProvider } from './context/AuthContext.js'

import { GeneralSettingsCtxProvider } from './context/GeneralSettingsCtxProvider.js'
import { MyProfileContextProvider } from './context/MyProfileContext.js'
import { ProfileContextProvider } from './context/ProfileContext.js'
import ResourceMainWrapper from './ed-resource/MainWrapper.js'

const MainComponent: MainAppPluginWrapper = ({ children }) => {
  return (
    <ResourceMainWrapper>
      <GeneralSettingsCtxProvider>
        <AuthCtxProvider>
          <ProfileContextProvider>
            <MyProfileContextProvider>{children}</MyProfileContextProvider>
          </ProfileContextProvider>
        </AuthCtxProvider>
      </GeneralSettingsCtxProvider>
    </ResourceMainWrapper>
  )
}
export default MainComponent
