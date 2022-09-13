import { createContext, useMemo } from 'react'
import { ReactAppPluginMainModule, WebAppShellOf } from '..'
import { RouteRegItem } from './app-routes'
import lib from './main-lib'
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
  }
}
export const MainContext = createContext<MainContextT>(null as any)

export const reactAppPluginMainModule: ReactAppPluginMainModule = {
  connect(shell) {
    const routes = createRegistry<RouteRegItem>()
    const avatarMenuItemsReg = createRegistry<HeaderAvatarMenuItemRegItem>()
    const rightComponentsReg = createRegistry<HeaderRightComponentRegItem>()
    const settingsSectionsReg = createRegistry<SettingsSectionItem>()

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

        return {
          ...lib,
          route: { ...routeReg },
          header: {
            avatarMenuItem: { ...avatarMenuItemGuest },
            rightComponent: { ...rightComponentGuest },
          },
          settings: {
            section: { ...settingsSectionsGuest },
          },
        }
      },
    }
  },
}
