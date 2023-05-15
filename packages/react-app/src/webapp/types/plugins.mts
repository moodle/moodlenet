import type { PkgIdentifier } from '@moodlenet/core'
import type { WebPkgDeps } from '../../common/types.mjs'
import type { PkgRpcHandle } from '../web-lib/pri-http/xhr-adapter/callPkgApis.mjs'

export type WebappShell<UsesPkgDeps extends WebPkgDeps> = {
  pkgId: PkgIdentifier
  rpc: {
    [key in keyof UsesPkgDeps]: PkgRpcHandle<UsesPkgDeps[key]['rpc']>
  }
}
