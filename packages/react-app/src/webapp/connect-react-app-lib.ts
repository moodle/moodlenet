import { ReactAppExt } from '..'
import { WebappPluginMainModule } from '../types'
import lib from './main-lib'
import { ContentGraphContext } from './ui/components/pages/ContentGraph/ContentGraphProvider'
import { useRegisterSettingsItem } from './ui/components/pages/Settings/SettingsContext'

export type ReactAppLib = {
  ui: typeof lib.ui
  contentGraph: typeof ContentGraphContext
  settings: {
    useRegisterSettingsItem: typeof useRegisterSettingsItem
  }
}
export type ReactAppPluginMainModule = WebappPluginMainModule<ReactAppExt, ReactAppLib>

export const reactAppPluginMainModule: ReactAppPluginMainModule = {
  connect() {
    return {
      pkgLibFor({ extId, extName, extVersion }) {
        return {
          ui: lib.ui,
          contentGraph: ContentGraphContext,
          useRegisterSettingsItem,
        }
      },
    }
  },
}
