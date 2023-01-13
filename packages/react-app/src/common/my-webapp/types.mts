import { expose as auth } from '@moodlenet/authentication-manager'
import type { expose as graph } from '@moodlenet/content-graph'
import type { expose as organization } from '@moodlenet/organization'
import type { expose as me } from '../../server/expose.mjs'
import type { PkgContextT } from '../../webapp/types/plugins.mjs'

export type MyWebAppDeps = {
  me: typeof me
  organization: typeof organization
  graph: typeof graph
  auth: typeof auth
}
export type MyPkgContext = PkgContextT<MyWebAppDeps>
