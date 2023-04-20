import { PkgContextT } from '@moodlenet/react-app/webapp'
import { WebUserExposeType } from '../expose-def.mjs'

export type MyWebAppDeps = {
  me: WebUserExposeType
}
export type MyPkgContext = PkgContextT<MyWebAppDeps>
