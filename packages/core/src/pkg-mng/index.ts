import * as path from 'path'
import rimraf from 'rimraf'
import { Ext } from '../types'
import { npmInstaller, symlinkInstaller } from './installers'
import * as lib from './lib'
import { InstallPkgReq, PackageInfo, PkgInstallationId } from './types'

// const myDirInfo = installDirsInfo();

export type PkgMngCfg = { pkgsFolder: string }
export function createPkgMng({ pkgsFolder }: PkgMngCfg) {
  return {
    install,
    uninstall,
    getAllPackagesInfo,
    getPackageInfo,
    getPkg,
  }

  async function uninstall({ pkgInstallationId }: { pkgInstallationId: PkgInstallationId }) {
    return new Promise<void>((pResolve, pReject) =>
      rimraf(getAbsInstallationFolder(pkgInstallationId), { disableGlob: true }, err =>
        err ? pReject(err) : pResolve(),
      ),
    )
  }

  async function install(installPkgReq: InstallPkgReq, useFolderName?: string) {
    const { pkgInstallationId } = await (installPkgReq.type === 'npm'
      ? npmInstaller({ installPkgReq, pkgsFolder, useFolderName })
      : symlinkInstaller({ installPkgReq, pkgsFolder, useFolderName }))
    try {
      const { ext, pkgInfo } = await getPkg({ pkgInstallationId })
      const date = new Date().toISOString()

      return { ext, pkgInfo, date }
    } catch (err) {
      await uninstall({ pkgInstallationId })
      throw err
    }
  }

  async function getPkg({
    pkgInstallationId,
  }: {
    pkgInstallationId: PkgInstallationId
  }): Promise<{ ext: Ext; pkgInfo: PackageInfo }> {
    const imported_module = require(getAbsInstallationFolder(pkgInstallationId))
    const ext = 'default' in imported_module ? imported_module.default : imported_module
    const pkgInfo = await getPackageInfo({ pkgInstallationId })
    lib.assertValidPkgModule(ext, pkgInfo)
    return { ext, pkgInfo }
  }

  async function getPackageInfo({ pkgInstallationId }: { pkgInstallationId: PkgInstallationId }) {
    return lib.getPackageInfo({ absFolder: getAbsInstallationFolder(pkgInstallationId) })
  }

  async function getAllPackagesInfo() {
    return lib.getAllPackagesInfo({ absFolder: pkgsFolder })
  }

  function getAbsInstallationFolder(pkgInstallationId: PkgInstallationId) {
    return path.resolve(pkgsFolder, pkgInstallationId)
  }
}
