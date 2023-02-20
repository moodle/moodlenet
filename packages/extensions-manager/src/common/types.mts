import { PkgContextT } from '@moodlenet/react-app/web-lib'
import type { expose as me } from '../server/expose.mjs'
export * from './data.mjs'
export * from './lib.mjs'
export * from './npmRegistry.mjs'

export type MyPkgDeps = { me: typeof me }
export type MyPkgContext = PkgContextT<MyPkgDeps>
