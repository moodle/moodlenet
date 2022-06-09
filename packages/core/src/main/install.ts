import { cp } from 'fs/promises'
import { resolve } from 'path'
import { InitResponse, makePkgMng } from '../npm-pkg'
import * as coreDeps from './core-pkgs'
import { InstallRes } from './types'

interface InstallCfg {
  installFolder: string
  _DEV_MODE_CORE_PKGS_FROM_FOLDER: boolean
}

export async function install(_cfg?: Partial<InstallCfg>): Promise<[InitResponse, InstallRes[]]> {
  const cfg: InstallCfg = {
    installFolder: _cfg?.installFolder ?? process.cwd(),
    _DEV_MODE_CORE_PKGS_FROM_FOLDER: _cfg?._DEV_MODE_CORE_PKGS_FROM_FOLDER ?? false,
  }

  // console.log('install cfg', cfg)
  const { _DEV_MODE_CORE_PKGS_FROM_FOLDER, installFolder } = cfg
  const pkgMng = makePkgMng({ wd: installFolder })
  const initResponse = await pkgMng.initWd()

  if (initResponse === 'newly-initialized-folder') {
    // const pkgDiskInfo = pkgDiskInfoOf(__dirname)
    // await pkgMng.install({ pkgLocator: pkgDiskInfo.rootDir })
    const coreInstallDeployRes = await installCorePackages()
    // console.log({ coreInstallDeployRes: coreInstallDeployRes.map(_ => _.extPkg.pkgDiskInfo.name) })
    // const coreInstallRes: InstallRes = { extPkg: { exts: [], pkgDiskInfo } }
    await cp(resolve(__dirname, '..', '..', 'ext-env-sample.js'), resolve(installFolder, 'ext-env.js'))

    return [initResponse, /* [coreInstallRes, ...*/ coreInstallDeployRes /* ] */]
  } else if (initResponse === 'folder-was-already-npm-initialized') {
    console.log(`installation folder ${installFolder} already has an initialized package`)
    return [initResponse, []]
  } else {
    throwNever(initResponse, `unknown option for initResponse:${initResponse}`)
  }

  return null as never

  async function installCorePackages(): Promise<InstallRes[]> {
    _DEV_MODE_CORE_PKGS_FROM_FOLDER
    const corePkgsInstallThunks = coreDeps
      .npmCorePkgList({ _DEV_MODE_CORE_PKGS_FROM_FOLDER })
      .map(pkgLocator => async (_: InstallRes[]) => {
        console.log('install', pkgLocator)
        const extPkg = await pkgMng.installAndExtract({ pkgLocator })
        return [..._, { extPkg }]
      })

    const corePkgsInstallRes = await corePkgsInstallThunks.reduce((prev, next) => _ => prev(_).then(next))([])

    return corePkgsInstallRes
  }
}

function throwNever(_: never, msg: string) {
  throw new Error(msg)
}
