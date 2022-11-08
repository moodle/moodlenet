import { ReactAppMainComponent, registries } from '@moodlenet/react-app/web-lib'
import { useMemo } from 'react'
import * as avatarmenuItem from './components/organisms/Header/Header.js'
import { MainContext } from './MainContext.js'
import Router from './Router.js'
import { MainContextT, WebPkgDeps } from './types.mjs'

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
