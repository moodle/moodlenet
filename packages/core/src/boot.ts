import * as kernel from '@moodlenet/kernel'
import { ExtBag, ExtPackage } from '@moodlenet/kernel'
import { getCoreExt } from './ext'
import './main/env'
import * as peerDeps from './peer-deps'
import { InstallRes } from './types'

export const INITIAL_INSTALL_CFG_FILE_NAME = 'MN_INITIAL_INSTALL_CFG_FILE.json'
export type InitialInstallCfg = {}

interface BootCfg {
  deploymentFolder: string
  initialPeerPkgsInstallRes?: InstallRes[]
}

export async function boot({ deploymentFolder, initialPeerPkgsInstallRes }: BootCfg) {
  console.log('boot ... ', { deploymentFolder, initialPeerPkgsInstallRes })
  const { extEnvVars /* , devMode  */ } = prepareConfigs()
  const K = await kernel.core.create({ extEnvVars })
  // console.log('KKKKKKK ... ', { K })
  const pkgMng = kernel.extPkg.makePkgMng({ wd: deploymentFolder })
  await deployEventualFirstInstall({ REMOVE_ME: true })
  return

  async function deployEventualFirstInstall({ REMOVE_ME }: { REMOVE_ME: true }) {
    ///
    ///
    ///
    ///
    ///
    ///
    /*FIXME: REMOVE_ME */
    if (!initialPeerPkgsInstallRes?.length && REMOVE_ME) {
      initialPeerPkgsInstallRes = peerDeps.pkgsInfoList().map(pkgInfo => {
        const pkgDiskInfo = kernel.extPkg.pkgDiskInfoOf(pkgMng.require.resolve(pkgInfo.name))
        const exts = pkgMng.require(pkgInfo.name).default
        const installRes: InstallRes = {
          extPkg: {
            exts,
            pkgDiskInfo,
          },
        }
        return installRes
      })
      // console.log('**********', { initialPeerPkgsInstallRes })
    }
    /*FIXME: REMOVE_ME */
    ///
    ///
    ///
    ///
    ///
    ///

    const corePkgDiskInfo_me = kernel.extPkg.pkgDiskInfoOf(__dirname)
    const coreExt = getCoreExt({ pkgMng, K })
    const coreExtPackage: ExtPackage = {
      exts: [coreExt],
      pkgDiskInfo: corePkgDiskInfo_me,
    }
    const coreInstallRes: InstallRes = {
      extPkg: coreExtPackage,
    }
    // console.log('**********', {
    //   initialPeerPkgsInstallRes: (initialPeerPkgsInstallRes ?? []).map(_ => _.extPkg.pkgDiskInfo.name),
    // })
    initialPeerPkgsInstallRes = (initialPeerPkgsInstallRes ?? []).filter(
      ({ extPkg }) => extPkg.pkgDiskInfo.name !== '@moodlenet/kernel', //HACK: hardcoded ! acceptable ?
    )
    // console.log('**********', {
    //   initialPeerPkgsInstallRes: (initialPeerPkgsInstallRes ?? []).map(_ => _.extPkg.pkgDiskInfo.name),
    // })

    const deployExts = [coreInstallRes, ...(initialPeerPkgsInstallRes ?? [])]
    const extBags = deployExts.flatMap(({ extPkg: { pkgDiskInfo, exts } }) => {
      // console.log({ pkgDiskInfo, exts })
      return exts.map(ext => {
        const bag: ExtBag = {
          ext,
          pkgDiskInfo,
        }
        return bag
      })
    })
    // console.log('deployExts ', inspect(deployExts, false, 10, true))
    const regDeployments = await K.enableAndDeployExtensions({ extBags })

    return regDeployments
  }

  function prepareConfigs() {
    const DEV_MODE_VALUE = 'development'
    const NODE_ENV = process.env.NODE_ENV ?? DEV_MODE_VALUE
    const devMode = NODE_ENV === DEV_MODE_VALUE
    const EXT_ENV_PATH = process.env.EXT_ENV ?? `${deploymentFolder}/ext-env`
    const extEnvVars: Record<string, any> = require(EXT_ENV_PATH)

    return {
      extEnvVars,
      devMode,
    }
  }
}
