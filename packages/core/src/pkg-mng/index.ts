import { readdir } from 'fs/promises'
import { resolve } from 'path'
import { npmInstaller, symlinkInstaller } from './installers'
import * as lib from './lib'
import { InstalledPackageInfo, InstallPkgReq, PackageInfo } from './types'

// const myDirInfo = installDirsInfo();

export type PkgMngCfg = { pkgsFolder: string; symlinkFolder: string }
export function createPkgMng({ pkgsFolder, symlinkFolder }: PkgMngCfg) {
  return {
    install,
    getAllInstalledPackagesInfo,
    getInstalledPackageInfo,
    getAllSymlinkPackagesInfo,
  }

  async function install(installPkgReq: InstallPkgReq, useFolderName?: string) {
    const { installationFolder } = await (installPkgReq.type === 'npm'
      ? npmInstaller({ installPkgReq, pkgsFolder, useFolderName })
      : symlinkInstaller({ installPkgReq, pkgsFolder, useFolderName }))
    await lib.writeInstallInfo({ absFolder: getAbsInstallationFolder(installationFolder), info: { installPkgReq } })
    const installedPackageInfo = await getInstalledPackageInfo(installationFolder)

    return installedPackageInfo
    // questa non funziona per le partizioni diverse su linux
    // await rename(InstallationInfo.InstallationFolder, resolve(pkgsFolder, safeInstallationFolder))
    // npm install
    // create info.json { installPkgReq: installPkgReq } (type InstalledPkgInfo )
  }

  async function getAllInstalledPackagesInfo(): Promise<InstalledPackageInfo[]> {
    const dir = await readdir(pkgsFolder, { withFileTypes: true })
    const pkgFolderNames = dir.filter(_ => _.isDirectory() || _.isSymbolicLink()).map(({ name }) => name)
    return Promise.all(pkgFolderNames.map(folder => getInstalledPackageInfo(folder)))
  }

  async function getAllSymlinkPackagesInfo(): Promise<PackageInfo[]> {
    console.log('getAllSymlinkPackagesInfo', symlinkFolder)
    const dir = await readdir(symlinkFolder, { withFileTypes: true })
    const pkgFolderNames = dir
      .filter(_ => _.isDirectory() || _.isSymbolicLink())
      .map(({ name }) => resolve(symlinkFolder, name))
    return Promise.all(pkgFolderNames.map(absFolder => lib.getPackageInfo({ absFolder })))
  }

  async function getInstalledPackageInfo(folder: string): Promise<InstalledPackageInfo> {
    return lib.getInstalledPackageInfo({ absFolder: getAbsInstallationFolder(folder) })
  }

  function getAbsInstallationFolder(folder: string) {
    return resolve(pkgsFolder, folder)
  }
}

/*
/pkgsFolder
  __moodlenet__passpoprt-auth_sdh7a/
    info.json
    src/
    lib/
    package.json
    node_modules/
  __moodlenet__email-pass-auth_sdh7a/
    info.json
    src/
    lib/
    package.json
    node_modules/
*/

/*******************************

  * */
