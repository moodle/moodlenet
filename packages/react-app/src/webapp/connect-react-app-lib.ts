import { ReactAppPluginMainModule } from '..'
import lib from './main-lib'

export type ReactAppLib = typeof lib

export const reactAppPluginMainModule: ReactAppPluginMainModule = {
  connect() {
    return {
      pkgLibFor(/* { extId, extName, extVersion } */) {
        return lib
      },
    }
  },
}
