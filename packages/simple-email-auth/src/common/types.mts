import { PkgContextT } from '@moodlenet/react-app/web-lib'
import type { expose as me } from '../server/expose.mjs'
export type MyWebDeps = { me: typeof me }
export type MyPkgContext = PkgContextT<MyWebDeps>
