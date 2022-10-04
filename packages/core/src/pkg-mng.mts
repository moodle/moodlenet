import execa from 'execa'
import { readdir } from 'fs/promises'
import * as path from 'path'
import { resolve } from 'path'
import { npmInstaller, symlinkInstaller } from './pkg-mng/installers.mjs'
import * as lib from './pkg-mng/lib.mjs'
import { InstallPkgReq } from './pkg-mng/types.mjs'
import { pkgIdByInfo } from './pkg-shell/connect/lib.mjs'
import { InstallResp, PkgIdentifier, SysInstalledPkg } from './types.mjs'

// const myDirInfo = installDirsInfo();

export type PkgMngCfg = { pkgsFolder: string }
export async function createPkgMng({ pkgsFolder }: PkgMngCfg) {
  await checkInitFolder()

  return {
    install,
    uninstall,
    getPackageInfo,
    getMain,
  }

  async function uninstall({ pkgId }: { pkgId: PkgIdentifier<any> }) {
    /* const installRes =  */ await execa('npm', ['uninstall', `${pkgId.name}`], {
      cwd: pkgsFolder,
      timeout: 600000,
    })
  }

  async function install(installPkgReq: InstallPkgReq): Promise<InstallResp> {
    const { pkgInfo } = await (installPkgReq.type === 'npm'
      ? npmInstaller({ installPkgReq, pkgsFolder })
      : symlinkInstaller({ installPkgReq, pkgsFolder }))
    const pkgId = pkgIdByInfo(pkgInfo)
    const date = new Date().toISOString()
    const sysInstalledPkg: SysInstalledPkg = {
      date,
      env: {},
      installPkgReq,
      pkgId,
    }
    return { sysInstalledPkg }
  }

  async function getMain({ pkgId }: { pkgId: PkgIdentifier<any> }): Promise<{ main: any }> {
    const { pkgRootDir: absFolder, packageJson } = await getPackageInfo({ pkgId })
    const absMainPath = resolve(absFolder, ...(packageJson.main?.split('/') ?? ['index.js']))
    const main = await import(absMainPath)
    return { main }
  }
  async function getPackageInfo({ pkgId }: { pkgId: PkgIdentifier<any> }) {
    return lib.getPackageInfo({ pkgRootDir: getAbsInstallationFolder({ pkgId }) })
  }

  function getAbsInstallationFolder({ pkgId }: { pkgId: PkgIdentifier<any> }) {
    return path.resolve(pkgsFolder, 'node_modules', ...pkgId.name.split('/'))
  }
  async function checkInitFolder() {
    if (await isInitialized()) {
      return
    }
    await execa('npm', ['-y', 'init'], {
      cwd: pkgsFolder,
      timeout: 600000,
    })
    async function isInitialized() {
      const dir = await readdir(pkgsFolder, {
        withFileTypes: true,
      })
      return (
        !!dir.find(entry => entry.name === 'package.json' && entry.isFile()) &&
        !!dir.find(entry => entry.name === 'node_modules' && entry.isDirectory())
      )
    }
  }
}
