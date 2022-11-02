import { ReactAppMainComponent, registries } from '@moodlenet/react-app/web-lib.mjs'
import { createContext, useEffect, useMemo } from 'react'
import { MainContextT, WebPkgDeps } from './types.mjs'
import Router from './Router.js'
import { Icon } from 'Header.js'

export const MainContext = createContext<MainContextT>(null as any)
const MainComponent: ReactAppMainComponent<WebPkgDeps> = ({ pkgs, pkgId, children }) => {
  // reactApp.header.avatarMenuItem.register(headerComponents)
  registries.avatarMenuItems.useRegister(pkgId, Icon)
  registries.routes.useRegister(pkgId, Router)
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
