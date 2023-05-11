import { AddToCollectionButtonByResourceContextContainer } from '@moodlenet/collection/webapp'
import type { ResourcePageGeneralActionsRegItem } from '@moodlenet/ed-resource/webapp'
import { ResourceContext } from '@moodlenet/ed-resource/webapp'
import { href } from '@moodlenet/react-app/common'
import type { HeaderRightComponentRegItem } from '@moodlenet/react-app/ui'
import type {
  ReactAppMainComponent,
  RouteRegItem,
  SettingsSectionItem,
} from '@moodlenet/react-app/webapp'
import { ReactAppContext, usePkgContext } from '@moodlenet/react-app/webapp'
import { useContext, useMemo } from 'react'

import type { MyPkgContext } from '../common/my-webapp/types.mjs'
import { AuthCtx, useAuthCtxValue } from './context/AuthContext.js'
import type { MainContextT } from './context/MainContext.mjs'
import { MainContext } from './context/MainContext.mjs'
import { LoginHeaderButton, SignupHeaderButton } from './exports/ui.mjs'
import { MyProfileContextProvider } from './MyProfileContext.js'
import { useMakeRegistries } from './registries.mjs'
import { routes } from './routes.js'
import { AddMenuContainer } from './ui/components/molecules/AddMenu/AddMenuContainer.js'
import { AvatarMenuContainer } from './ui/components/molecules/AvatarMenu/AvatarMenuContainer.js'
import { UsersContainer } from './ui/components/organisms/Roles/UsersContainer.js'
const routeRegItem: RouteRegItem = { routes }
const settingsSectionItem: SettingsSectionItem = {
  Content: UsersContainer,
  Menu: () => <span>Users</span>,
}

const addToCollectionButtonRegItem: ResourcePageGeneralActionsRegItem = {
  Item: AddToCollectionButtonByResourceContextContainer,
}

const avatarMenuItem: HeaderRightComponentRegItem = { Component: AvatarMenuContainer }
const addMenuItem: HeaderRightComponentRegItem = { Component: AddMenuContainer }
const loginButtonHeaderItem: HeaderRightComponentRegItem = {
  Component: () => <LoginHeaderButton loginHref={href('/login')} />,
}
const signupButtonHeaderItem: HeaderRightComponentRegItem = {
  Component: () => <SignupHeaderButton signupHref={href('/signup')} />,
}

const MainComponent: ReactAppMainComponent = ({ children }) => {
  const pkgContext = usePkgContext<MyPkgContext>()
  const resourceContext = useContext(ResourceContext)

  const registries = useMakeRegistries()
  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = {
      ...pkgContext,
      registries,
    }
    return ctx
  }, [pkgContext, registries])
  const authCtx = useAuthCtxValue(registries, mainContext)
  const reactAppCtx = useContext(ReactAppContext)
  reactAppCtx.registries.headerRightComponents.useRegister(addMenuItem, {
    condition: !!authCtx?.isAuthenticated && !authCtx.clientSessionData.isRoot,
  })
  reactAppCtx.registries.headerRightComponents.useRegister(avatarMenuItem, {
    condition: !!authCtx?.isAuthenticated,
  })
  reactAppCtx.registries.headerRightComponents.useRegister(loginButtonHeaderItem, {
    condition: !authCtx?.isAuthenticated,
  })
  reactAppCtx.registries.headerRightComponents.useRegister(signupButtonHeaderItem, {
    condition: !authCtx?.isAuthenticated,
  })

  resourceContext.registries.resourcePageGeneralActions.useRegister(addToCollectionButtonRegItem, {
    condition: !!authCtx?.isAuthenticated && !authCtx.clientSessionData.isRoot,
  })

  reactAppCtx.registries.settingsSections.useRegister(settingsSectionItem)
  reactAppCtx.registries.routes.useRegister(routeRegItem)

  return (
    authCtx && (
      <MainContext.Provider value={mainContext}>
        <AuthCtx.Provider value={authCtx}>
          <MyProfileContextProvider>{children}</MyProfileContextProvider>
        </AuthCtx.Provider>
      </MainContext.Provider>
    )
  )
}
export default MainComponent
