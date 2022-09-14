import { createContext, useMemo } from 'react'
import { ReactAppLib, ReactAppPluginMainModule, WebAppShellOf } from '..'
import { RouteRegItem } from './app-routes'
import lib from './main-lib'
import { LoginItem, SignupItem } from './main-lib/auth'
import { createRegistry, RegistryHandler } from './main-lib/registry'
import { HeaderAvatarMenuItemRegItem, HeaderRightComponentRegItem } from './ui/components/organisms/Header'
import { SettingsSectionItem } from './ui/components/pages/Settings/SettingsContext'

export type MainContextT = {
  shell: WebAppShellOf<ReactAppPluginMainModule>
  registries: {
    routes: RegistryHandler<RouteRegItem>
    header: {
      avatarMenuItems: RegistryHandler<HeaderAvatarMenuItemRegItem>
      rightComponents: RegistryHandler<HeaderRightComponentRegItem>
    }
    settings: {
      sections: RegistryHandler<SettingsSectionItem>
    }
    auth: {
      login: RegistryHandler<LoginItem>
      signup: RegistryHandler<SignupItem>
    }
  }
}
export const MainContext = createContext<MainContextT>(null as any)

export const reactAppPluginMainModule: ReactAppPluginMainModule = {
  connect(shell) {
    const routes = createRegistry<RouteRegItem>()
    const avatarMenuItemsReg = createRegistry<HeaderAvatarMenuItemRegItem>()
    const rightComponentsReg = createRegistry<HeaderRightComponentRegItem>()
    const settingsSectionsReg = createRegistry<SettingsSectionItem>()
    const loginItemsReg = createRegistry<LoginItem>()
    const signupItemsReg = createRegistry<SignupItem>()

    return {
      MainComponent({ children }) {
        const mainContext = useMemo<MainContextT>(() => {
          const ctx: MainContextT = {
            registries: {
              header: {
                avatarMenuItems: avatarMenuItemsReg,
                rightComponents: rightComponentsReg,
              },
              routes,
              settings: {
                sections: settingsSectionsReg,
              },
              auth: {
                login: loginItemsReg,
                signup: signupItemsReg,
              },
            },
            shell,
          }
          return ctx
        }, [])
        // console.log({ mainContext })
        return <MainContext.Provider value={mainContext}>{children}</MainContext.Provider>
      },
      pkgLibFor({ pkg }) {
        const routeReg = routes.host({ pkg })
        const avatarMenuItemGuest = avatarMenuItemsReg.host({ pkg })
        const rightComponentGuest = rightComponentsReg.host({ pkg })
        const settingsSectionsGuest = settingsSectionsReg.host({ pkg })
        const loginItemsGuest = loginItemsReg.host({ pkg })
        const signupItemsGuest = signupItemsReg.host({ pkg })
        const reactAppLib: ReactAppLib = {
          ...lib,
          route: { ...routeReg },
          header: {
            avatarMenuItem: { ...avatarMenuItemGuest },
            rightComponent: { ...rightComponentGuest },
          },
          settings: {
            section: { ...settingsSectionsGuest },
          },
          auth: {
            login: { ...loginItemsGuest },
            signup: { ...signupItemsGuest },
          },
        }
        return reactAppLib
      },
    }
  },
}
