import type { PkgContextT } from '@moodlenet/react-app/webapp'
import type { ExtMngrExposeType } from './expose-def.mjs'
export * from './data.mjs'
export * from './lib.mjs'
export * from './npmRegistry.mjs'

export type MyPkgDeps = { me: ExtMngrExposeType }
export type MyPkgContext = PkgContextT<MyPkgDeps>
