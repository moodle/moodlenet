import type { expose as me } from '../expose.mjs'
import { PkgContextT } from '@moodlenet/react-app/web-lib'

export type MyPkgDeps = { me: typeof me }
export type MyPkgContext = PkgContextT<MyPkgDeps>
