import type { MainAppPluginWrapper } from '@moodlenet/react-app/webapp'

import { AuthCtx, useAuthCtxValue } from './context/AuthContext.js'
import { MyProfileContextProvider } from './MyProfileContext.js'

const MainComponent: MainAppPluginWrapper = ({ children }) => {
  const authCtx = useAuthCtxValue()

  return (
    authCtx && (
      <AuthCtx.Provider value={authCtx}>
        <MyProfileContextProvider>{children}</MyProfileContextProvider>
      </AuthCtx.Provider>
    )
  )
}
export default MainComponent
