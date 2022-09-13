import { createContext, useMemo } from 'react'
import { ReactAppLib, ReactAppPluginMainModule, WebAppShellOf } from '..'
import { RouteRegItem } from './app-routes'
import lib from './main-lib'
import { LoginItem, SignupItem } from './main-lib/auth'
import { createRegistry, Registry } from './main-lib/registry'
import { HeaderAvatarMenuItemRegItem, HeaderRightComponentRegItem } from './ui/components/organisms/Header'
import { SettingsSectionItem } from './ui/components/pages/Settings/SettingsContext'

export type MainContextT = {
  shell: WebAppShellOf<ReactAppPluginMainModule>
  registries: {
    routes: Registry<RouteRegItem>
    header: {
      avatarMenuItems: Registry<HeaderAvatarMenuItemRegItem>
      rightComponents: Registry<HeaderRightComponentRegItem>
    }
    settings: {
      sections: Registry<SettingsSectionItem>
    }
    auth: {
      login: Registry<LoginItem>
      signup: Registry<SignupItem>
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
          return {
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
