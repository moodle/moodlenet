import { ReactAppPluginMainModule } from '..'
import lib from './main-lib'
import { createRegistry } from './main-lib/registry'

export const reactAppPluginMainModule: ReactAppPluginMainModule = {
  connect() {
    const XReg = createRegistry<{ a: number }>()
    return {
      MainComponent({ children }) {
        console.log({ XReg })
        return <>{children}</>
      },
      pkgLibFor({ extId /* , extName, extVersion  */ }) {
        return {
          ...lib,
          collectX: XReg.host({ extId }),
        }
      },
    }
  },
}
