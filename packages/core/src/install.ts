import { makePkgMng, pkgDiskInfoOf } from '@moodlenet/kernel/lib/npm-pkg'
import { InitResponse } from '@moodlenet/kernel/lib/npm-pkg/mng'
import { cp } from 'fs/promises'
import { resolve } from 'path'
import * as peerDeps from './peer-deps'
import { InstallRes } from './types'

interface InstallCfg {
  installFolder: string
  initDevInstallFromLocalRepo: boolean
}

export async function install(_cfg?: Partial<InstallCfg>): Promise<[InitResponse, InstallRes[]]> {
  const cfg: InstallCfg = {
    installFolder: _cfg?.installFolder ?? process.cwd(),
    initDevInstallFromLocalRepo: _cfg?.initDevInstallFromLocalRepo ?? false,
  }

  // console.log('install cfg', cfg)
  const { initDevInstallFromLocalRepo, installFolder } = cfg
  const pkgMng = makePkgMng({ wd: installFolder })
  const initResponse = await pkgMng.initWd()

  if (initResponse === 'newly-initialized-folder') {
    const pkgDiskInfo = pkgDiskInfoOf(__dirname)
    await pkgMng.install({ pkgLocator: pkgDiskInfo.rootDir })
    const peerInstallDeployRes = await installPeerDeps()
    const coreInstallRes: InstallRes = { extPkg: { exts: [], pkgDiskInfo } }
    await cp(resolve(__dirname, '..', 'ext-env-sample.js'), resolve(installFolder, 'ext-env.js'))

    return [initResponse, [coreInstallRes, ...peerInstallDeployRes]]
  } else if (initResponse === 'folder-was-already-npm-initialized') {
    console.log(`installation folder ${installFolder} already has an initialized package`)
    return [initResponse, []]
  } else {
    throwNever(initResponse, `unknown option for initResponse:${initResponse}`)
  }

  return initResponse

  async function installPeerDeps(): Promise<InstallRes[]> {
    const corePkgsFromFolder = initDevInstallFromLocalRepo
      ? resolve(__dirname, '..', '..', '..', 'packages')
      : undefined
    // console.log('**npmInstallList:', JSON.stringify(npmInstallList({ corePkgsFromFolder })))

    const peerInstallThunks = peerDeps
      .npmInstallList({ corePkgsFromFolder })
      .map(pkgLocator => async (_: InstallRes[]) => {
        console.log('install', pkgLocator)
        const extPkg = await pkgMng.installAndExtract({ pkgLocator })
        return [..._, { extPkg }]
      })

    const peerInstallRes = await peerInstallThunks.reduce((prev, next) => _ => prev(_).then(next))([])

    return peerInstallRes
  }
}

function throwNever(_: never, msg: string) {
  throw new Error(msg)
}
