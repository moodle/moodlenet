import assert from 'assert'
import { resolve } from 'path'
import { splitExtId } from '../core-lib'
import { InitResponse, makePkgMng } from '../npm-pkg'
import { MainFolders, SysConfig, SysEnabledExtDecl, SysEnabledExtensions, SysPackages, SysPkgDecl } from '../types/sys'
import { getConfigs } from './configs'
import corePkgs from './core-pkgs'
import { getRegistry } from './default-consts'

type InstallCfg = {
  folders: MainFolders
  registry?: string
  _DEV_MODE_CORE_PKGS_FROM_FOLDER: boolean
}

export default async function install({
  _DEV_MODE_CORE_PKGS_FROM_FOLDER = false,
  folders,
  registry,
}: InstallCfg): Promise<InitResponse> {
  const configs = getConfigs({ folders })
  const pkgMng = makePkgMng(folders)

  const initResponse = await pkgMng.initWd()

  if (initResponse === 'folder-was-already-npm-initialized') {
    console.log(`installation folder ${folders.deployment} already has an initialized package`)
    return initResponse
  }
  assert(initResponse === 'newly-initialized-folder')

  await configs.createSysPkgStorageFolder()
  const installedPackages = getCoreSysPackages()

  await pkgMng.install(installedPackages)

  const enabledExtensions = Object.keys(installedPackages)
    // .filter(pkgName => pkgName !== pkgInfo.name)
    .map(pkgName => {
      const { pkgDiskInfo, pkgExport } = pkgMng.extractPackage(pkgName)
      console.log({ pkgDiskInfo, pkgExport })
      return pkgExport.exts.reduce<SysEnabledExtensions>((_acc, ext) => {
        const { extName, version } = splitExtId(ext.id)
        const sysEnabledExtDecl: SysEnabledExtDecl = {
          order: -1,
          pkg: pkgName,
          version,
        }
        return { ..._acc, [extName]: sysEnabledExtDecl }
      }, {})
    })
    .reduce<SysEnabledExtensions>((_acc, sysEnableExtensions) => {
      Object.keys(sysEnableExtensions).forEach(extName =>
        assert(!(extName in _acc), 'found duplicates ext name for sysEnableExtensions ${extName}'),
      )
      return {
        ..._acc,
        ...sysEnableExtensions,
      }
    }, {})
  console.log({ enabledExtensions })

  const sysConfig: SysConfig = {
    installedPackages,
    enabledExtensions,
    __FIRST_INSTALL: true,
  }

  await configs.writeLocalDeplConfig({ extensions: {} })
  await configs.writeSysConfig(sysConfig)

  return initResponse
  // const pkgDiskInfo = pkgDiskInfoOf(__dirname)
  // await pkgMng.install({ pkgLocator: pkgDiskInfo.rootDir })

  // async function installCorePackages(): Promise<InstallRes[]> {
  //   _DEV_MODE_CORE_PKGS_FROM_FOLDER
  //   const corePkgsInstallThunks = coreDeps
  //     .npmCorePkgList({ _DEV_MODE_CORE_PKGS_FROM_FOLDER })
  //     .map(pkgLocator => async (_: InstallRes[]) => {
  //       console.log('install', pkgLocator)
  //       const extPkg = await pkgMng.installAndExtract({ pkgLocator })
  //       return [..._, { extPkg }]
  //     })

  //   const corePkgsInstallRes = await corePkgsInstallThunks.reduce((prev, next) => _ => prev(_).then(next))([])

  //   return corePkgsInstallRes
  // }

  function getCoreSysPackages(): SysPackages {
    const dev_packages_folder = resolve(__dirname, '..', '..', '..')
    const sysPackages = Object.entries(corePkgs).reduce<SysPackages>((_acc, [pkgName, version]) => {
      const pkgDecl: SysPkgDecl = _DEV_MODE_CORE_PKGS_FROM_FOLDER
        ? {
            type: 'file',
            location: `file:${resolve(dev_packages_folder, pkgName)}`,
          }
        : {
            type: 'npm',
            version,
            registry: getRegistry(registry),
          }

      return { ..._acc, [`@moodlenet/${pkgName}`]: pkgDecl }
    }, {})
    return sysPackages
  }
}
