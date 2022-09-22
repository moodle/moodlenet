import execa from 'execa'
import * as path from 'path'
import { resolve } from 'path'
import { npmInstaller, symlinkInstaller } from './pkg-mng/installers.mjs'
import * as lib from './pkg-mng/lib.mjs'
import { InstallPkgReq, PkgIdentifier } from './pkg-mng/types.mjs'
import { SysInstalledPkg } from './types.mjs'

// const myDirInfo = installDirsInfo();

export type PkgMngCfg = { pkgsFolder: string }
export async function createPkgMng({ pkgsFolder }: PkgMngCfg) {
  await execa('npm', ['-y', 'init'], {
    cwd: pkgsFolder,
    timeout: 600000,
  })

  return {
    install,
    uninstall,
    getPackageInfo,
    getMain,
  }

  async function uninstall({ pkgId }: { pkgId: PkgIdentifier }) {
    /* const installRes =  */ await execa('npm', ['uninstall', `${pkgId.name}`], {
      cwd: pkgsFolder,
      timeout: 600000,
    })
  }

  async function install(installPkgReq: InstallPkgReq): Promise<{ sysInstalledPkg: SysInstalledPkg }> {
    const { pkgId } = await (installPkgReq.type === 'npm'
      ? npmInstaller({ installPkgReq, pkgsFolder })
      : symlinkInstaller({ installPkgReq, pkgsFolder }))
    try {
      const date = new Date().toISOString()
      const sysInstalledPkg: SysInstalledPkg = {
        date,
        env: {},
        installPkgReq,
        pkgId,
      }
      return { sysInstalledPkg }
    } catch (err) {
      console.error('install error', err)
      await uninstall({ pkgId })
      throw err
    }
  }

  async function getMain({ pkgId }: { pkgId: PkgIdentifier }): Promise<{ main: any }> {
    const { pkgRootDir: absFolder, packageJson } = await getPackageInfo({ pkgId })
    const absMainPath = resolve(absFolder, ...(packageJson.main?.split('/') ?? ['index.js']))
    const main = await import(absMainPath)
    return { main }
  }
  async function getPackageInfo({ pkgId }: { pkgId: PkgIdentifier }) {
    return lib.getPackageInfo({ pkgRootDir: getAbsInstallationFolder({ pkgId }) })
  }

  function getAbsInstallationFolder({ pkgId }: { pkgId: PkgIdentifier }) {
    return path.resolve(pkgsFolder, 'node_modules', ...pkgId.name.split('/'))
  }
}
