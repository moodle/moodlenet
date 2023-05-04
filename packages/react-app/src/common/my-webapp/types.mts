import type { PkgContextT } from '../../webapp/types/plugins.mjs'
import type { ReactAppExposeType } from '../expose-def.mjs'

export type MyWebAppDeps = {
  me: ReactAppExposeType
}
export type MyPkgContext = PkgContextT<MyWebAppDeps>
