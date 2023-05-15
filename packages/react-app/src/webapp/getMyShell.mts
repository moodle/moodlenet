import type { WebPkgDeps } from '../common/types.mjs'
import type { WebappShell } from './exports/webapp.mjs'
import { getCurrentPluginMainInitializerObject } from './plugin-initializer.mjs'
import { pkgRpcs } from './web-lib/pri-http/xhr-adapter/callPkgApis.mjs'

export function getMyShell<UsesPkgDeps extends WebPkgDeps>(): WebappShell<UsesPkgDeps> {
  const { deps, pkgId } = getCurrentPluginMainInitializerObject(`getMyShell`)

  const rpc = Object.entries(deps).reduce((_rpc, [depName, { rpcPaths, targetPkgId }]) => {
    return { ..._rpc, [depName]: pkgRpcs(targetPkgId, pkgId, rpcPaths) }
  }, {} as WebappShell<UsesPkgDeps>['rpc'])
  const shell: WebappShell<UsesPkgDeps> = {
    pkgId,
    rpc,
  }
  return shell
}
