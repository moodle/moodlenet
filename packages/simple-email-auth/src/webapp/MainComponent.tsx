import { ReactAppMainComponent } from '@moodlenet/react-app/web-lib.mjs'
import { createContext, useMemo } from 'react'
import { MainContextT, WebPkgDeps } from './types.mjs'

export const MainContext = createContext<MainContextT>(null as any)
const MainComponent: ReactAppMainComponent<WebPkgDeps> = ({ pkgs, children }) => {
  // reactApp.auth.login.register(loginComponents)
  // reactApp.auth.signup.register(signupComponents)
  // reactApp.settings.section.register(settingsComponents)
  // reactApp.route.register({ routes: Router })
  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = {
      pkgs,
    }
    return ctx
  }, [])
  // console.log({ mainContext })
  return <MainContext.Provider value={mainContext}>{children}</MainContext.Provider>
}
export default MainComponent
