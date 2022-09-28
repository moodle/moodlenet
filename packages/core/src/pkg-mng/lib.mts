import assert from 'assert'
import { readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { PackageInfo, PkgIdentifier, SafePackageJson } from './types.mjs'

const infos: Record<string, PackageInfo> = {}
export function getPackageInfo({ pkgRootDir }: { pkgRootDir: string }): PackageInfo {
  const _already_computed = infos[pkgRootDir]
  if (_already_computed) {
    return _already_computed
  }

  const safePackageJson = getSafePackageJson({ pkgRootDir })
  const rootfilenames = readdirSync(pkgRootDir, { withFileTypes: true })
  const readmefile = rootfilenames.find(file => file.isFile() && file.name.toLowerCase().split('.').at(0) === 'readme')
  const readme = readmefile?.name ? readFileSync(resolve(pkgRootDir, readmefile.name), 'utf-8') : ''
  //const rootDirPosix = posix.normalize(absFolder)
  // const installationInfo =  readInstallInfoFileName({ absFolder })
  const packageInfo: PackageInfo = {
    // ...installationInfo,
    packageJson: safePackageJson,
    readme,
    pkgId: pkgIdOf({
      safePackageJson,
    }),
    pkgRootDir,
  }
  infos[pkgRootDir] = packageInfo
  return packageInfo
}
export function getSafePackageJson({ pkgRootDir }: { pkgRootDir: string }): SafePackageJson {
  const safePackageJson: SafePackageJson = JSON.parse(readFileSync(resolve(pkgRootDir, 'package.json'), 'utf-8'))
  assert(safePackageJson.name, 'package has no name')
  assert(safePackageJson.version, 'package has no version')
  return safePackageJson
}
export function getPackageIdIn({ pkgRootDir }: { pkgRootDir: string }): PkgIdentifier {
  const safePackageJson: SafePackageJson = getSafePackageJson({ pkgRootDir })
  return pkgIdOf({ safePackageJson })
}
export function pkgIdOf({ safePackageJson }: { safePackageJson: SafePackageJson }): PkgIdentifier {
  return {
    name: safePackageJson.name,
    version: safePackageJson.version,
  }
}

const DEFAULT_NPM_REGISTRY = 'https://registry.npmjs.org'
export const getRegistry = (_reg?: string | undefined) =>
  _reg ?? process.env.NPM_CONFIG_REGISTRY ?? DEFAULT_NPM_REGISTRY

/* 
export function assertValidPkgModule(module: any, pkgInfo: PackageInfo): asserts module is Ext {
  try {
    assert(!!module, `no module! ${module}`)
    const { name: moduleName, version, requires, connect } = module
    assert('string' === typeof moduleName, `invalid name type : ${typeof moduleName}`) // : ExtName<Def>
    assert('string' === typeof version, `invalid version type : ${typeof version}`) // : ExtName<Def>
    assert(Array.isArray(requires), `invalid requires type : ${typeof requires}`) // : { [Index in keyof Requires]: _Unsafe_ExtId<Requires[Index]> }
    assert('function' === typeof connect, `invalid connect type : ${typeof connect}`) // : ExtDeploy<Def>
    const validId = moduleName === pkgInfo.packageJson.name && version === pkgInfo.packageJson.version
    assert(
      validId,
      `pkg module's [name, version] should be [${pkgInfo.packageJson.name},${pkgInfo.packageJson.version}] .. found [${moduleName},${version}]`,
    )
  } catch (e) {
    console.error({ pkgInfo, module })
    throw e
  }
}
 */
