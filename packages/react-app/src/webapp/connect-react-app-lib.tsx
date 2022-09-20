import { useMemo } from 'react'
import type { ReactAppLib, ReactAppPluginMainModule } from '..'
import type { RouteRegItem } from './app-routes'
import lib from './main-lib'
import type { LoginItem, SignupItem } from './main-lib/auth'
import { createRegistry } from './main-lib/registry'
import { MainContext, MainContextT } from './MainContext'
import type { HeaderAvatarMenuItemRegItem, HeaderRightComponentRegItem } from './ui/components/organisms/Header'
import type { SettingsSectionItem } from './ui/components/pages/Settings/SettingsContext'

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
