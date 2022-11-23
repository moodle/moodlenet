import { HeaderMenuItemRegItem } from '@moodlenet/react-app/ui'
import { AuthCtx, ReactAppMainComponent, registries } from '@moodlenet/react-app/web-lib'
import { useContext, useMemo } from 'react'
import * as avatarmenuItem from './components/organisms/Header/Header.js'
import { MainContext } from './MainContext.js'
import Router from './Router.js'
import { MainContextT, WebPkgDeps } from './types.mjs'

const avatarmenuItemReg: HeaderMenuItemRegItem = {
  Icon: '', //<avatarmenuItem.IconContainer />,
  Path: avatarmenuItem.path,
  Text: avatarmenuItem.text,
  ClassName: avatarmenuItem.className,
  Position: avatarmenuItem.position,
}

const MainComponent: ReactAppMainComponent<WebPkgDeps> = ({ pkgs, pkgId, children }) => {
  const { clientSessionData } = useContext(AuthCtx)
  registries.avatarMenuItems.useRegister(pkgId, avatarmenuItemReg, {
    condition: !!clientSessionData?.myUserNode, // TODO: should have chance to check myUserNode against GlyphDescriptor Profile !
  })
  registries.routes.useRegister(pkgId, Router)

  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = { pkgs, pkgId }
    return ctx
  }, [pkgs, pkgId])
  // console.log({ mainContext })
  return <MainContext.Provider value={mainContext}>{children}</MainContext.Provider>
}
export default MainComponent
