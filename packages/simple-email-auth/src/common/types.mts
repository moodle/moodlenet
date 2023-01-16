import { PkgContextT } from '@moodlenet/react-app/web-lib'
import type { expose as me } from '../expose.mjs'
import type { expose as auth } from '@moodlenet/authentication-manager'
export type MyWebDeps = { me: typeof me; auth: typeof auth }
export type MyPkgContext = PkgContextT<MyWebDeps>
