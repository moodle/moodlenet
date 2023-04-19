import { PkgContextT } from '@moodlenet/react-app/web-lib'
import { WebUserExposeType } from '../expose-def.mjs'

export type MyWebAppDeps = {
  me: WebUserExposeType
}
export type MyPkgContext = PkgContextT<MyWebAppDeps>
