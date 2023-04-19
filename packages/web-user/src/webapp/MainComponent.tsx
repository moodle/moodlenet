import {
  ReactAppContext,
  ReactAppMainComponent,
  SettingsSectionItem,
  usePkgContext,
} from '@moodlenet/react-app/web-lib'
import { useContext, useMemo } from 'react'

import { MyPkgContext } from '../common/my-webapp/types.mjs'
import { AuthProvider } from './context/AuthContext.js'
import { MainContext, MainContextT } from './context/MainContext.mjs'
import { useMakeRegistries } from './registries.mjs'
import { routes } from './routes.js'
import { UsersContainer } from './ui/components/organisms/Roles/UsersContainer.js'

const settingsSectionItem: SettingsSectionItem = {
  Content: UsersContainer,
  Menu: () => <span>Users</span>,
}

const MainComponent: ReactAppMainComponent = ({ children }) => {
  const pkgContext = usePkgContext<MyPkgContext>()
  const reactAppCtx = useContext(ReactAppContext)
  const registries = useMakeRegistries()
  reactAppCtx.registries.settingsSections.useRegister(settingsSectionItem)
  reactAppCtx.registries.routes.useRegister({ routes })
  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = {
      ...pkgContext,
      registries,
    }
    return ctx
  }, [pkgContext, registries])

  return (
    <MainContext.Provider value={mainContext}>
      <AuthProvider registries={registries}>{children}</AuthProvider>
    </MainContext.Provider>
  )
}
export default MainComponent
