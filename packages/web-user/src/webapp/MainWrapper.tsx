import type { MainAppPluginWrapper } from '@moodlenet/react-app/webapp'
import { AuthCtxProvider } from './context/AuthContext.js'

import { MyProfileContextProvider } from './MyProfile/MyProfileContext.js'

const MainComponent: MainAppPluginWrapper = ({ children }) => {
  return (
    <AuthCtxProvider>
      <MyProfileContextProvider>{children}</MyProfileContextProvider>
    </AuthCtxProvider>
  )
}
export default MainComponent
