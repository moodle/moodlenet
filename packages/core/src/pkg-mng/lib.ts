import assert from 'assert'
import { readdir, readFile } from 'fs/promises'
import { basename, resolve } from 'path'
import { Ext } from '../types'
import { PackageInfo, SafePackageJson } from './types'

export async function getAllPackagesInfo({ absFolder }: { absFolder: string }): Promise<PackageInfo[]> {
  const pkgFolderNames = await getAllFoldersIn({ absFolder })
  return Promise.all(pkgFolderNames.map(({ abs }) => getPackageInfo({ absFolder: abs })))
}

export async function getAllFoldersIn({ absFolder }: { absFolder: string }) {
  const dir = await readdir(absFolder, { withFileTypes: true })
  const pkgFolderNames = dir
    .filter(_ => _.isDirectory() || _.isSymbolicLink())
    .map(({ name }) => resolve(absFolder, name))
  return pkgFolderNames.map(name => ({ name, abs: resolve(absFolder, name) }))
}

export async function getPackageInfo({ absFolder }: { absFolder: string }): Promise<PackageInfo> {
  const packageJson: SafePackageJson = JSON.parse(await readFile(resolve(absFolder, 'package.json'), 'utf-8'))
  assert(packageJson.name, 'package has no name')
  assert(packageJson.version, 'package has no version')
  const rootfilenames = await readdir(absFolder, { withFileTypes: true })
  const readmefile = rootfilenames.find(file => file.isFile() && file.name.toLowerCase().split('.').at(0) === 'readme')
  const readme = readmefile?.name ? await readFile(resolve(absFolder, readmefile.name), 'utf-8') : ''
  //const rootDirPosix = posix.normalize(absFolder)
  // const installationInfo = await readInstallInfoFileName({ absFolder })
  const packageInfo: PackageInfo = {
    // ...installationInfo,
    packageJson,
    readme,
    id: basename(absFolder),
  }
  console.log({ packageInfo })
  return packageInfo
}

/* 
export const installInfoFileName = ({ absFolder }: { absFolder: string }) => resolve(absFolder, INSTALL_INFO_FILENAME)

export async function readInstallInfoFileName({ absFolder }: { absFolder: string }) {
  const info: PkgInstallationInfo = JSON.parse(await readFile(installInfoFileName({ absFolder }), 'utf-8'))
  return info
}

export async function writeInstallInfo({ absFolder, info }: { absFolder: string; info: PkgInstallationInfo }) {
  await writeFile(installInfoFileName({ absFolder }), JSON.stringify(info, null, 2))
}

export const INSTALL_INFO_FILENAME = 'install-info.json'
*/

export function assertValidPkgModule(module: any, pkgInfo: PackageInfo): asserts module is Ext {
  console.log({
    module,
    pkgInfo,
  })
  assert(!!module, `no module! ${module}`)
  const { name: moduleName, version, requires, wireup, install, uninstall } = module
  assert('string' === typeof moduleName, `invalid name type : ${typeof moduleName}`) // : ExtName<Def>
  assert('string' === typeof version, `invalid version type : ${typeof version}`) // : ExtName<Def>
  assert(Array.isArray(requires), `invalid requires type : ${typeof requires}`) // : { [Index in keyof Requires]: _Unsafe_ExtId<Requires[Index]> }
  assert('function' === typeof wireup, `invalid wireup type : ${typeof wireup}`) // : ExtWireup<Def>
  assert(['undefined', 'function'].includes(typeof install), `invalid install type : ${typeof install}`) // ?: ExtInstall<Def>
  assert(['undefined', 'function'].includes(typeof uninstall), `invalid uninstall type : ${typeof uninstall}`) // ?: ExtUninstall<Def>
  const validId = moduleName === pkgInfo.packageJson.name && version === pkgInfo.packageJson.version
  assert(
    validId,
    `pkg module's [name, version] should be [${pkgInfo.packageJson.name},${pkgInfo.packageJson.version}] .. found [${moduleName},${version}]`,
  )
}
