import { ReactAppMainComponent } from '@moodlenet/react-app/web-lib'
import { createContext, useMemo } from 'react'
import { MainContextT, WebPkgDeps } from './types.mjs'

export const MainContext = createContext<MainContextT>(null as any)
const MainComponent: ReactAppMainComponent<WebPkgDeps> = ({ pkgs, pkgId, children }) => {
  // reactApp.header.avatarMenuItem.register(headerComponents)
  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = {
      pkgs,
      pkgId,
    }
    return ctx
  }, [])
  // console.log({ mainContext })
  return <MainContext.Provider value={mainContext}>{children}</MainContext.Provider>
}
export default MainComponent
