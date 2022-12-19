import type authConn from '@moodlenet/authentication-manager'
import type graphConn from '@moodlenet/content-graph'
import type coreConn from '@moodlenet/core'
import type organizationConn from '@moodlenet/organization'
import type myconnection from '../../server/main.mjs'
import { PkgContextT } from '../../webapp/types/plugins.mjs'

export type MyPkgContext = PkgContextT<
  typeof myconnection,
  {
    organization: typeof organizationConn
    auth: typeof authConn
    graph: typeof graphConn
    core: typeof coreConn
  }
>
