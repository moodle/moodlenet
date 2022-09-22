import assert from 'assert'
import { dirname } from 'path'
import { packageDirectorySync } from 'pkg-dir'
import { fileURLToPath } from 'url'
import { getPackageInfo } from '../pkg-mng/lib.mjs'
import { PkgIdentifier } from '../types.mjs'
import {
  ApiDef,
  ApiDefPaths,
  ApiDefs,
  ApiFn,
  ApiFnType,
  ArgsValidation,
  CtxApiFn,
  FlattenApiDefs,
  FloorApiCtx,
  PkgConnection,
  PkgRef,
} from './types.mjs'

const CONNECTION_SYMBOL: unique symbol = Symbol('CONNECTION_SYMBOL')

export function connect<_ApiDefs extends ApiDefs = {}>(
  meta_or_module: NodeModule | ImportMeta,
  apiDefs: _ApiDefs,
): PkgRef<_ApiDefs> {
  const { pkgInfo } = getModulePackageReferences(meta_or_module)
  assert(!getConnectionByMetaOrModule(meta_or_module), `can't connect ${pkgInfo.pkgId.name} more than once !`)
  const flatApiDefs = flattenApiDefs<_ApiDefs>(apiDefs)
  // console.log({ apisRefs: flattenApiDefs }, inspect(apiDefs))

  const connection: PkgConnection<_ApiDefs> = {
    pkgInfo,
    apiDefs,
    flatApiDefs,
  }

  registerConnection(connection)
  console.log(`connected pkg ${pkgInfo.pkgId.name}@${pkgInfo.pkgId.version}`)

  const pkgRef: PkgRef<_ApiDefs> = {
    pkgInfo,
  }
  return pkgRef
}

export function pkgApis<_ApiDefs extends ApiDefs>(
  caller_meta_or_module: NodeModule | ImportMeta,
  targetPkgRef: PkgRef<_ApiDefs>,
) {
  const { pkgInfo: callerPkgInfo } = getModulePackageReferences(caller_meta_or_module)

  const callerConnection = getConnectionByPkgId(callerPkgInfo.pkgId)
  assert(callerConnection, `cannot use apis() for non connected packages ${callerPkgInfo.pkgId.name}`)
  const targetConnection = getConnectionByPkgId(targetPkgRef.pkgInfo.pkgId)
  assert(targetConnection, `cannot call apis() on non connected target ${callerConnection?.pkgInfo.pkgId.name}`)

  return function locateApi<Path extends ApiDefPaths<_ApiDefs>>(path: Path) {
    const apiDef = targetConnection.flatApiDefs[path]
    assert(apiDef, `no apiDef in ${targetPkgRef.pkgInfo.pkgId.name}::${path}`)

    return function setCallApiOpts({ ctx = {} }: { ctx?: FloorApiCtx }): ApiFnType<_ApiDefs, Path> {
      return async function callApi(...args: any[]) {
        const _argValidity = await apiDef.argsValidation(...args)
        const argValidity = 'boolean' === typeof _argValidity ? { valid: _argValidity, msg: undefined } : _argValidity
        if (!argValidity.valid) {
          throw new TypeError(`invalid api params, msg: ${argValidity.msg ?? 'no details'}`)
        }
        return apiDef.api({ ...ctx, caller: callerConnection.pkgInfo })(...args)
      } as ApiFnType<_ApiDefs, Path>
    }
  }
}

export function defApi<_ApiFn extends ApiFn>(api: CtxApiFn<_ApiFn>, argsValidation: ArgsValidation): ApiDef<_ApiFn> {
  return {
    api,
    argsValidation,
    ...{ [CONNECTION_SYMBOL]: CONNECTION_SYMBOL },
  }
}

/*
 * util
 */
function isNodeModule(meta_or_module: NodeModule | ImportMeta): meta_or_module is NodeModule {
  return 'exports' in meta_or_module
}

function flattenApiDefs<_ApiDefs extends ApiDefs>(apiDefs: _ApiDefs, subPath = ''): FlattenApiDefs<_ApiDefs> {
  return Object.entries(apiDefs).reduce((_, [key, val]) => {
    return isApiDef(val) ? { ..._, [`${subPath}${key}`]: val } : { ..._, ...flattenApiDefs(val, `${key}/`) }
  }, {})
}

function isApiDef(ctxApiEntry: ApiDefs | ApiDef<any> | undefined): ctxApiEntry is ApiDef<any> {
  return (
    !!ctxApiEntry && (ctxApiEntry as any)[CONNECTION_SYMBOL] === CONNECTION_SYMBOL
    // 'api' in ctxApiEntry &&
    // 'function' === typeof ctxApiEntry.api &&
    // 'argsValidation' in ctxApiEntry &&
    // 'function' === typeof ctxApiEntry.argsValidation &&
  )
}

function getModulePackageReferences(meta_or_module: NodeModule | ImportMeta) {
  const moduleFilename = isNodeModule(meta_or_module) ? meta_or_module.id : fileURLToPath(meta_or_module.url)

  const moduleDir = dirname(moduleFilename)
  const pkgRootDir = packageDirectorySync({ cwd: moduleDir })
  assert(pkgRootDir, `no pkgRootDir found for ${moduleDir}`)
  const pkgInfo = getPackageInfo({ pkgRootDir })

  return { moduleFilename, moduleDir, pkgRootDir, pkgInfo }
}
/*
 * pkg Connections registry
 */
const connections: Record<string, PkgConnection<any>> = {}

function getConnectionByPkgId(pkgId: PkgIdentifier) {
  return connections[pkgId.name]
}
function getConnectionByMetaOrModule(meta_or_module: NodeModule | ImportMeta) {
  const {
    pkgInfo: { pkgId },
  } = getModulePackageReferences(meta_or_module)
  return getConnectionByPkgId(pkgId)
}
function registerConnection(connection: PkgConnection<any>) {
  connections[connection.pkgInfo.pkgId.name] = connection
}
