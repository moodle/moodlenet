import { readdir, rename } from 'fs/promises'
import { resolve } from 'path'
import { getPackageInfo, getSafeFolderPkgName, InstalledPackageInfo } from './lib'
import { folderTmpInstaller, InstallPkgReq, npmTmpInstaller } from './tmp-installers'
import { PkgMngCfg } from './types'
export function createPkgMng({ pkgsFolder }: PkgMngCfg) {
  return {
    install,
    getAllInstalledPackagesInfo,
  }

  async function install(installPkgReq: InstallPkgReq) {
    const tmpInstallationInfo = await (installPkgReq.type === 'npm'
      ? npmTmpInstaller(installPkgReq)
      : folderTmpInstaller(installPkgReq))

    const tmpInstallPackageInfo = await getPackageInfo(tmpInstallationInfo.tmpInstallationFolder)

    const safeInstallationFolder = getSafeFolderPkgName(tmpInstallPackageInfo.packageJson)
    await rename(tmpInstallationInfo.tmpInstallationFolder, resolve(pkgsFolder, safeInstallationFolder))
    // npm install
    // create info.json { installPkgReq: installPkgReq } (type InstalledPkgInfo )
  }

  async function getAllInstalledPackagesInfo(): Promise<InstalledPackageInfo[]> {
    const dir = await readdir(pkgsFolder, { withFileTypes: true })
    return Promise.all(dir.filter(_ => _.isDirectory()).map(({ name: folder }) => getInstalledPackageInfo(folder)))
  }

  async function getInstalledPackageInfo(folder: string): Promise<InstalledPackageInfo> {
    return getPackageInfo(resolve(pkgsFolder, folder))
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
