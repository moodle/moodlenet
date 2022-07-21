import * as path from 'path'
import rimraf from 'rimraf'
import { npmInstaller, symlinkInstaller } from './installers'
import * as lib from './lib'
import { InstalledPackageInfo, InstallPkgReq } from './types'

// const myDirInfo = installDirsInfo();

export type PkgMngCfg = { pkgsFolder: string }
export function createPkgMng({ pkgsFolder }: PkgMngCfg) {
  return {
    install,
    uninstall,
    getAllInstalledPackagesInfo,
    getInstalledPackageInfo,
  }

  async function uninstall({ installationFolder }: { installationFolder: string }) {
    return new Promise<void>((pResolve, pReject) =>
      rimraf(getAbsInstallationFolder(installationFolder), { disableGlob: true }, err =>
        err ? pReject(err) : pResolve(),
      ),
    )
  }
  async function install(installPkgReq: InstallPkgReq, useFolderName?: string) {
    const { installationFolder } = await (installPkgReq.type === 'npm'
      ? npmInstaller({ installPkgReq, pkgsFolder, useFolderName })
      : symlinkInstaller({ installPkgReq, pkgsFolder, useFolderName }))
    await lib.writeInstallInfo({ absFolder: getAbsInstallationFolder(installationFolder), info: { installPkgReq } })
    const installedPackageInfo = await getInstalledPackageInfo({ installationFolder })

    return installedPackageInfo
    // questa non funziona per le partizioni diverse su linux
    // await rename(InstallationInfo.InstallationFolder, resolve(pkgsFolder, safeInstallationFolder))
    // npm install
    // create info.json { installPkgReq: installPkgReq } (type InstalledPkgInfo )
  }

  async function getAllInstalledPackagesInfo(): Promise<InstalledPackageInfo[]> {
    return lib.getAllInstalledPackagesInfo({ absFolder: pkgsFolder })
  }

  async function getInstalledPackageInfo({
    installationFolder,
  }: {
    installationFolder: string
  }): Promise<InstalledPackageInfo> {
    return lib.getInstalledPackageInfo({ absFolder: getAbsInstallationFolder(installationFolder) })
  }

  function getAbsInstallationFolder(installationFolder: string) {
    return path.resolve(pkgsFolder, installationFolder)
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
