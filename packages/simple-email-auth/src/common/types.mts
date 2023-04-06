import { PkgContextT } from '@moodlenet/react-app/web-lib'
import { SimpleEmailAuthExposeType } from './expose-def.mjs'
export type MyWebDeps = { me: SimpleEmailAuthExposeType }
export type MyPkgContext = PkgContextT<MyWebDeps>
