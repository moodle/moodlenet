import type { PkgContextT } from '@moodlenet/react-app/webapp'
import type { EdMetaExposeType } from './expose-def.mjs'

export type EdMetaEntityNames = 'IscedField' | 'IscedGrade'
export type MyWebDeps = {
  me: EdMetaExposeType
}

export type MyPkgContext = PkgContextT<MyWebDeps>
