import type { expose as auth } from '@moodlenet/authentication-manager/server'
import { PkgContextT } from '@moodlenet/react-app/web-lib'
import type { expose as me } from '../server/expose.mjs'
export type MyWebDeps = { me: typeof me; auth: typeof auth }
export type MyPkgContext = PkgContextT<MyWebDeps>
