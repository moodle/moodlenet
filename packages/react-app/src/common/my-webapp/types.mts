import type authConn from '../../../../authentication-manager/dist/init.mjs'
import type graphConn from '../../../../content-graph/dist/init.mjs'
import type coreConn from '@moodlenet/core'
import type organizationConn from '../../../../organization/dist/init.mjs'
import type myconnection from '../../server/init.mjs'
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
