import { pkgConnection } from '@moodlenet/core'
import httpSrvPkgRef from '@moodlenet/http-server'
import kvsPkgRef from '@moodlenet/key-value-store'
export const kvsPkgApis = await pkgConnection(import.meta, kvsPkgRef)
export const kvStore = await kvsPkgApis('getStore')()
export const httpSrvPkgApis = await pkgConnection(import.meta, httpSrvPkgRef)
//# sourceMappingURL=use-pkg-apis.mjs.map
