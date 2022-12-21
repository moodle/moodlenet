import assert from 'assert'
import { readdir, readFile } from 'fs/promises'
import { dirname, resolve } from 'path'
import { packageDirectorySync } from 'pkg-dir'
import { fileURLToPath } from 'url'
import { PkgModuleRef } from '../../init.mjs'
import { WORKING_DIR } from '../../main/env.mjs'
import { PkgIdentifier } from '../../types.mjs'
import { PackageInfo, SafePackageJson } from '../types.mjs'

function isNodeModule(pkg_module_ref: PkgModuleRef): pkg_module_ref is NodeModule {
  return 'exports' in pkg_module_ref
}

export function getPkgModuleFilename(pkg_module_ref: PkgModuleRef) {
  return isNodeModule(pkg_module_ref) ? pkg_module_ref.id : fileURLToPath(pkg_module_ref.url)
}

export function getPkgModulePaths(pkg_module_ref: PkgModuleRef) {
  const moduleFilename = getPkgModuleFilename(pkg_module_ref)
  const moduleDir = dirname(moduleFilename)
  return { moduleDir, moduleFilename }
}

export async function getPkgModuleInfo(pkg_module_ref: PkgModuleRef) {
  const { moduleDir, moduleFilename } = getPkgModulePaths(pkg_module_ref)
  const pkgRootDir = packageDirectorySync({ cwd: moduleDir })
  assert(pkgRootDir, `no pkgRootDir found for ${moduleDir}`)
  const pkgInfo = await getPackageInfoIn({ pkgRootDir })

  return { moduleFilename, moduleDir, pkgInfo }
}

const infos: Record<string, PackageInfo> = {}
export async function getPackageInfo({
  pkgId,
}: {
  pkgId: PkgIdentifier | Pick<PkgIdentifier, 'name'>
}) {
  return getPackageInfoIn({
    pkgRootDir: resolve(WORKING_DIR, 'node_modules', ...pkgId.name.split('/')),
  })
}

export async function getPackageInfoIn({ pkgRootDir }: { pkgRootDir: string }) {
  const _already_computed = infos[pkgRootDir]
  if (_already_computed) {
    return _already_computed
  }

  const safePackageJson = await getSafePackageJson({ pkgRootDir })
  const rootfilenames = await readdir(pkgRootDir, { withFileTypes: true })
  const readmefilename = safePackageJson.readme
    ? safePackageJson.readme
    : rootfilenames.find(
        file => file.isFile() && file.name.toLowerCase().split('.').at(0) === 'readme',
      )?.name
  const readme = readmefilename ? await readFile(resolve(pkgRootDir, readmefilename), 'utf-8') : ''
  //const rootDirPosix = posix.normalize(absFolder)
  // const installationInfo =  readInstallInfoFileName({ absFolder })
  const packageInfo: PackageInfo = {
    // ...installationInfo,
    packageJson: safePackageJson,
    readme,

    pkgRootDir,
  }
  infos[pkgRootDir] = packageInfo
  return packageInfo
}

export async function getSafePackageJson({
  pkgRootDir,
}: {
  pkgRootDir: string
}): Promise<SafePackageJson> {
  const safePackageJson: SafePackageJson = JSON.parse(
    await readFile(resolve(pkgRootDir, 'package.json'), 'utf-8'),
  )
  assert(safePackageJson.name, 'package has no name')
  assert(safePackageJson.version, 'package has no version')
  return safePackageJson
}
