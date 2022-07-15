import assert from 'assert'
import { readdir, readFile, writeFile } from 'fs/promises'
import { basename, resolve } from 'path'
import { InstalledPackageInfo, PackageInfo, PkgInstallationInfo, SafePackageJson } from './types'

export async function getInstalledPackageInfo({ absFolder }: { absFolder: string }): Promise<InstalledPackageInfo> {
  const pkgInfo = await getPackageInfo({ absFolder })
  const mainModAbsPath = resolve(absFolder, pkgInfo.mainModPath ?? '')
  //console.log({mainModAbsPath,absFolder, pkgInfo_mainModPath: pkgInfo.mainModPath})
  const pkgMainMod = await import(mainModAbsPath)
  const hasDefault = 'default' in pkgMainMod
  const pkgExport = hasDefault ? pkgMainMod.default : pkgMainMod
  const installInfo = await readInstallInfoFileName({ absFolder })
  return {
    ...pkgInfo,
    pkgExport,
    installationInfo: installInfo,
  }
}

export async function getPackageInfo({ absFolder }: { absFolder: string }): Promise<PackageInfo> {
  const packageJson: SafePackageJson = JSON.parse(await readFile(resolve(absFolder, 'package.json'), 'utf-8'))
  assert(packageJson.name, 'package has no name')
  assert(packageJson.version, 'package has no version')
  const pkgMainModule = packageJson.main
  const rootfilenames = await readdir(absFolder, { withFileTypes: true })
  const readmefile = rootfilenames.find(file => file.isFile() && file.name.toLowerCase().split('.').at(0) === 'readme')
  const readme = readmefile?.name ? await readFile(resolve(absFolder, readmefile.name), 'utf-8') : ''
  //const rootDirPosix = posix.normalize(absFolder)
  const packageInfo: PackageInfo = {
    packageJson,
    readme,
    installationFolder: basename(absFolder),
    mainModPath: pkgMainModule,
    //rootDir: absFolder,
    //rootDirPosix,
  }
  console.log({ packageInfo })
  return packageInfo
}

export const installInfoFileName = ({ absFolder }: { absFolder: string }) => resolve(absFolder, INSTALL_INFO_FILENAME)

export async function readInstallInfoFileName({ absFolder }: { absFolder: string }) {
  const info: PkgInstallationInfo = JSON.parse(await readFile(installInfoFileName({ absFolder }), 'utf-8'))
  return info
}

export async function writeInstallInfo({ absFolder, info }: { absFolder: string; info: PkgInstallationInfo }) {
  await writeFile(installInfoFileName({ absFolder }), JSON.stringify(info, null, 2))
}

export const INSTALL_INFO_FILENAME = 'install-info.json'
