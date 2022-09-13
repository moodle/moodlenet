import { createContext, useMemo } from 'react'
import { PkgIds, ReactAppPluginMainModule } from '..'
import { RouteRegItem } from './app-routes'
import lib from './main-lib'
import { createRegistry, Registry } from './main-lib/registry'
import { HeaderAvatarMenuItemRegItem, HeaderRightComponentRegItem } from './ui/components/organisms/Header'

export type MainContextT = {
  pkg: PkgIds
  registries: {
    routes: Registry<RouteRegItem>
    header: {
      avatarMenuItems: Registry<HeaderAvatarMenuItemRegItem>
      rightComponents: Registry<HeaderRightComponentRegItem>
    }
  }
}
export const MainContext = createContext<MainContextT>(null as any)

export const reactAppPluginMainModule: ReactAppPluginMainModule = {
  connect({ pkg }) {
    const routes = createRegistry<RouteRegItem>()
    const avatarMenuItems = createRegistry<HeaderAvatarMenuItemRegItem>()
    const rightComponents = createRegistry<HeaderRightComponentRegItem>()

    return {
      MainComponent({ children }) {
        const mainContext = useMemo<MainContextT>(() => {
          return {
            registries: {
              header: {
                avatarMenuItems,
                rightComponents,
              },
              routes,
            },
            pkg,
          }
        }, [])
        // console.log({ mainContext })
        return <MainContext.Provider value={mainContext}>{children}</MainContext.Provider>
      },
      pkgLibFor({ pkg }) {
        const routeReg = routes.host({ pkg })
        const avatarMenuItemReg = avatarMenuItems.host({ pkg })
        const rightComponentReg = rightComponents.host({ pkg })
        return {
          ...lib,
          route: { ...routeReg },
          header: {
            avatarMenuItem: { ...avatarMenuItemReg },
            rightComponent: { ...rightComponentReg },
          },
        }
      },
    }
  },
}
