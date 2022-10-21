import { ReactAppMainComponent } from '@moodlenet/react-app/web-lib.mjs'
import { createContext, useEffect, useMemo } from 'react'
import { MainContextT, WebPkgDeps } from './types.mjs'

export const MainContext = createContext<MainContextT>(null as any)
const MainComponent: ReactAppMainComponent<WebPkgDeps> = ({ pkgs, pkgId, children }) => {
  // reactApp.header.avatarMenuItem.register(headerComponents)
  useEffect(() => {
    console.log('web-user plugin mainComponent pkgs', { pkgs })
  }, [pkgs])
  useEffect(() => {
    console.log('web-user plugin mainComponent pkgId', { pkgId })
  }, [pkgId])

  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = { pkgs, pkgId }
    return ctx
  }, [pkgs, pkgId])
  // console.log({ mainContext })
  return <MainContext.Provider value={mainContext}>{children}</MainContext.Provider>
}
export default MainComponent
