import assert from 'assert'
import { readdir, readFile } from 'fs/promises'
import { resolve } from 'path'
import { WORKING_DIR } from '../main/env.mjs'
import { PkgIdentifier } from '../types.mjs'
import { PackageInfo, SafePackageJson } from './types.mjs'
import execa from 'execa'
import { InstallPkgReq } from './types.mjs'

export async function uninstall({ pkgId }: { pkgId: PkgIdentifier<any> }) {
  await execa('npm', ['uninstall', `${pkgId.name}`], {
    cwd: WORKING_DIR,
    timeout: 600000,
  })
}

export async function install(installPkgReqs: InstallPkgReq[]) {
  const installPkgsArgs = installPkgReqs.map(instReq =>
    instReq.type === 'npm'
      ? `${instReq.pkgId.name}@${instReq.pkgId.version}`
      : `file:${instReq.fromFolder}`,
  )
  await execa('npm', ['install', '--registry', NPM_REGISTRY, ...installPkgsArgs], {
    cwd: WORKING_DIR,
    timeout: 600000,
  })
}

const infos: Record<string, PackageInfo> = {}
export async function getPackageInfo({
  pkgId,
}: {
  pkgId: PkgIdentifier<any> | Pick<PkgIdentifier<any>, 'name'>
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

export const NPM_REGISTRY =
  process.env.NPM_CONFIG_REGISTRY ??
  process.env.npm_config_registry ??
  'https://registry.npmjs.org/'
