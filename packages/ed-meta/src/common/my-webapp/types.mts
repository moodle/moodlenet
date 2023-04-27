import { PkgContextT } from '@moodlenet/react-app/webapp'
import { EdMetaExposeType } from '../expose-def.mjs'

export type MyWebAppDeps = {
  me: EdMetaExposeType
}
export type MyPkgContext = PkgContextT<MyWebAppDeps>
