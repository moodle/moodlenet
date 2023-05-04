import type { PkgContextT } from '@moodlenet/react-app/webapp'
import type { SimpleEmailAuthExposeType } from './expose-def.mjs'
export type MyWebDeps = { me: SimpleEmailAuthExposeType }
export type MyPkgContext = PkgContextT<MyWebDeps>
