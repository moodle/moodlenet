import * as path from 'path'
import rimraf from 'rimraf'
import { Ext } from '../types'
import { npmInstaller, symlinkInstaller } from './installers'
import * as lib from './lib'
import { InstallPkgReq, PkgInstallationId, PkgInstallationInfo } from './types'

// const myDirInfo = installDirsInfo();

export type PkgMngCfg = { pkgsFolder: string }
export function createPkgMng({ pkgsFolder }: PkgMngCfg) {
  return {
    install,
    uninstall,
    getAllPackagesInfo,
    getPackageInfo,
    getModule,
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
    const info: PkgInstallationInfo = { installPkgReq, date: new Date().toISOString() }
    await lib.writeInstallInfo({ absFolder: getAbsInstallationFolder(pkgInstallationId), info })
    const installedPackageInfo = await getPackageInfo({ pkgInstallationId })
    const module = await getModule({ pkgInstallationId })
    try {
      lib.assertValidPkgModule(module, installedPackageInfo)
    } catch (err) {
      await uninstall({ pkgInstallationId })
      throw err
    }
    return installedPackageInfo
  }

  async function getModule({ pkgInstallationId }: { pkgInstallationId: PkgInstallationId }): Promise<Ext> {
    const imported_module = require(getAbsInstallationFolder(pkgInstallationId))
    const module = 'default' in imported_module ? imported_module.default : imported_module
    return module
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
