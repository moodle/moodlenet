import type { MainAppPluginWrapper } from '@moodlenet/react-app/webapp'
import { AuthCtxProvider } from './context/AuthContext.js'

import { MyWebUserContextProvider } from './MyWebUser/MyWebUserContextProvider.js'

const MainComponent: MainAppPluginWrapper = ({ children }) => {
  return (
    <AuthCtxProvider>
      <MyWebUserContextProvider>{children}</MyWebUserContextProvider>
    </AuthCtxProvider>
  )
}
export default MainComponent
