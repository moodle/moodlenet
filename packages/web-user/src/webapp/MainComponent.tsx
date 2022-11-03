import { ReactAppMainComponent, registries } from '@moodlenet/react-app/web-lib'
import { createContext, useMemo } from 'react'
import { MainContextT, WebPkgDeps } from './types.mjs'
import Router from './Router.js'
import * as avatarmenuItem from './Header.js'

export const MainContext = createContext<MainContextT>(null as any)

const MainComponent: ReactAppMainComponent<WebPkgDeps> = ({ pkgs, pkgId, children }) => {
  registries.avatarMenuItems.useRegister(pkgId, avatarmenuItem)
  registries.routes.useRegister(pkgId, Router)

  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = { pkgs, pkgId }
    return ctx
  }, [pkgs, pkgId])
  // console.log({ mainContext })
  return <MainContext.Provider value={mainContext}>{children}</MainContext.Provider>
}
export default MainComponent
