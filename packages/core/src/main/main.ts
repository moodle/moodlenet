import { makePkgMng } from '../npm-pkg'
import { createLocalDeploymentRegistry } from '../registry'
import { MainFolders, SysConfig, SysPackages } from '../types/sys'
import { getConfigs } from './configs'

type Cfg = {
  folders: MainFolders
}

export async function getMain(cfg: Cfg) {
  const configs = getConfigs({ folders: cfg.folders })

  const pkgMng = makePkgMng(configs.folders)
  const deployments = createLocalDeploymentRegistry()

  // await ensureInstallPackages()
  return {
    deployments,
    pkgMng,
    configs,
    installPackages,
    // ensureInstallPackages,
  }

  // async function ensureInstallPackages() {
  //   const _sysConfig = await configs.getSysConfig()
  //   await installPackages(_sysConfig.installedPackages)
  // }

  async function installPackages(packages: SysPackages) {
    await pkgMng.install(packages)
    const _sysConfig = await configs.getSysConfig()
    const newSysConfig: SysConfig = {
      ..._sysConfig,
      installedPackages: { ..._sysConfig.installedPackages, ...packages },
    }
    await configs.writeSysConfig(newSysConfig)
    return newSysConfig
  }
}
