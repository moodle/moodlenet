import { HeaderMenuItemRegItem } from '@moodlenet/react-app/ui'
import {
  AuthCtx,
  ReactAppContext,
  ReactAppMainComponent,
  SettingsSectionItem,
  usePkgContext,
} from '@moodlenet/react-app/web-lib'
import { useContext, useMemo } from 'react'
import { MyPkgContext } from '../types.mjs'
import { UsersContainer } from '../ui.mjs'
import * as avatarmenuItem from './components/organisms/Header/Header.js'
import { MainContext } from './MainContext.js'
import Router from './Router.js'
import { MainContextT } from './types.mjs'

const avatarmenuItemReg: HeaderMenuItemRegItem = {
  Icon: '', //<avatarmenuItem.IconContainer />,
  Path: avatarmenuItem.path,
  Text: avatarmenuItem.text,
  ClassName: avatarmenuItem.className,
  Position: avatarmenuItem.position,
}

const settingsSectionItem: SettingsSectionItem = {
  Content: UsersContainer,
  Menu: () => <span>User Types </span>,
}

const MainComponent: ReactAppMainComponent = ({ children }) => {
  const pkgCtx = usePkgContext<MyPkgContext>()
  const { clientSessionData } = useContext(AuthCtx)
  const { registries } = useContext(ReactAppContext)
  registries.avatarMenuItems.useRegister(avatarmenuItemReg, {
    condition: !!clientSessionData?.myUserNode, // TODO: should have chance to check myUserNode against GlyphDescriptor Profile !
  })
  registries.routes.useRegister(Router)
  registries.settingsSections.useRegister(settingsSectionItem)

  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = { ...pkgCtx }
    return ctx
  }, [pkgCtx])
  // console.log({ mainContext })
  return <MainContext.Provider value={mainContext}>{children}</MainContext.Provider>
}
export default MainComponent
