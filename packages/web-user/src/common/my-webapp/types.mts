import type { PkgContextT } from '@moodlenet/react-app/webapp'
import type { WebUserExposeType } from '../expose-def.mjs'

export type MyWebAppDeps = {
  me: WebUserExposeType
}
export type MyPkgContext = PkgContextT<MyWebAppDeps>
