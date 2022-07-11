import { readdir, rename } from 'fs/promises'
import { resolve } from 'path'
import { getPackageInfo, getSafeFolderPkgName, InstalledPackageInfo } from './lib'
import { folderTmpInstaller, InstallPkgReq, npmTmpInstaller } from './tmp-installers'
import { PkgMngCfg } from './types'
export function createPkgMng({ pkgsFolder }: PkgMngCfg) {
  return {
    install,
    getInstalledPackagesInfo: getAllInstalledPackagesInfo,
  }

  async function install(installPkgReq: InstallPkgReq) {
    const tmpInstallationInfo = await (installPkgReq.type === 'npm'
      ? npmTmpInstaller(installPkgReq)
      : folderTmpInstaller(installPkgReq))

    const tmpInstallPackageInfo = await getPackageInfo(tmpInstallationInfo.tmpInstallationFolder)

    const sageInstallationFolder = getSafeFolderPkgName(tmpInstallPackageInfo.packageJson)
    await rename(tmpInstallationInfo.tmpInstallationFolder, resolve(pkgsFolder, sageInstallationFolder))
  }

  async function getAllInstalledPackagesInfo(): Promise<InstalledPackageInfo[]> {
    const dir = await readdir(pkgsFolder, { withFileTypes: true })
    return Promise.all(dir.filter(_ => _.isDirectory()).map(({ name: folder }) => getInstalledPackageInfo(folder)))
  }

  async function getInstalledPackageInfo(folder: string): Promise<InstalledPackageInfo> {
    return getPackageInfo(resolve(pkgsFolder, folder))
  }
}
