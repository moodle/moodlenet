import assert from 'assert'
import { dirname } from 'path'
import { packageDirectorySync } from 'pkg-dir'
import { fileURLToPath } from 'url'
import { inspect } from 'util'
import { getPackageInfo } from '../pkg-mng/lib.mjs'
import { PackageInfo } from '../types.mjs'
import { ApiDef, ApiDefPaths, ApiDefs, ApiFnType, FloorApiCtx, PkgConnection } from './types.mjs'

export function connect<_ApiDefs extends ApiDefs = {}>(meta_or_module: NodeModule | ImportMeta, apiDefs: _ApiDefs) {
  const { /* moduleFilename, */ /* moduleDir, pkgRootDir, */ pkgInfo } = getModulePackageInfo(meta_or_module)
  // console.log({
  //   moduleFilename,
  //   moduleDir,
  //   pkgRootDir,
  // })
  assert(!getConnection(meta_or_module), `can't connect ${pkgInfo.pkgId.name} more than once !`)
  const apisRefs = flattenApiDefs(apiDefs)
  console.log({ apisRefs }, inspect(apiDefs))
  const shell: Shell<_ApiDefs> = {
    pkgInfo,
    apiDefs,
  }
  const connection: PkgConnection = {
    shell,
    apiDefs,
  }
  registerConnection(connection)
  console.log(`connected pkg ${pkgInfo.pkgId.name}@${pkgInfo.pkgId.version}`)
  return {
    pkgInfo,
    apis,
  }
  function apis(caller_meta_or_module: NodeModule | ImportMeta) {
    const callerConnection = getConnection(caller_meta_or_module)
    assert(
      callerConnection,
      `cannot use apis() for non connected packages ${callerConnection?.shell.pkgInfo.pkgId.name}`,
    )
    return function locateApi<Path extends ApiDefPaths<_ApiDefs>>(path: Path) {
      const apiDef = apisRefs[path]
      assert(apiDef, `no apiDef in ${pkgInfo.pkgId.name}::${path}`)

      return function setCallApiCtx(ctx: FloorApiCtx = {}): ApiFnType<_ApiDefs, Path> {
        const callApi: any = async (...args: any[]) => {
          const _argValidity = await apiDef.argsValidation(...args)
          console.log({ _argValidity })
          const argValidity = 'boolean' === typeof _argValidity ? { valid: _argValidity, msg: undefined } : _argValidity
          if (!argValidity.valid) {
            throw new TypeError(`invalid api params [${argValidity.msg ?? 'no details'}]`)
          }
          return apiDef.api({ ...ctx, caller: callerConnection.shell.pkgInfo })(...args)
        }
        return callApi
      }
    }
  }
}

/*
 * util
 */

function flattenApiDefs(apiDefs: ApiDefs, subPath = ''): Record<string, ApiDef<any>> {
  return Object.entries(apiDefs).reduce((_, [key, val]) => {
    return isApiDef(val) ? { ..._, [`${subPath}${key}`]: val } : { ..._, ...flattenApiDefs(val, `${key}/`) }
  }, {})
}

function isApiDef(ctxApiEntry: ApiDefs | ApiDef<any> | undefined): ctxApiEntry is ApiDef<any> {
  return (
    !!ctxApiEntry &&
    'api' in ctxApiEntry &&
    'function' === typeof ctxApiEntry.api &&
    'argsValidation' in ctxApiEntry &&
    'function' === typeof ctxApiEntry.argsValidation
  )
}

export type Shell<_ApiDefs extends ApiDefs> = {
  pkgInfo: PackageInfo
  apiDefs: _ApiDefs
}

function getModulePackageInfo(meta_or_module: NodeModule | ImportMeta) {
  const moduleFilename = 'exports' in meta_or_module ? meta_or_module.id : fileURLToPath(meta_or_module.url)

  const moduleDir = dirname(moduleFilename)
  const pkgRootDir = packageDirectorySync({ cwd: moduleDir })
  assert(pkgRootDir, `no pkgRootDir found for ${moduleDir}`)
  const pkgInfo = getPackageInfo({ pkgRootDir })

  return { moduleFilename, moduleDir, pkgRootDir, pkgInfo }
}
/*
 * pkg Connections registry
 */
const connections: Record<string, PkgConnection> = {}
function getConnection(meta_or_module: NodeModule | ImportMeta) {
  const { pkgInfo } = getModulePackageInfo(meta_or_module)
  return connections[pkgInfo.pkgId.name]
}
function registerConnection(connection: PkgConnection) {
  connections[connection.shell.pkgInfo.pkgId.name] = connection
}
