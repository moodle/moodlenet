import type { expose as organization } from '@moodlenet/organization/server'
import type { expose as me } from '../../server/expose.mjs'
import type { PkgContextT } from '../../webapp/types/plugins.mjs'

export type MyWebAppDeps = {
  me: typeof me
  organization: typeof organization
}
export type MyPkgContext = PkgContextT<MyWebAppDeps>
