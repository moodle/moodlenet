import * as kernel from '@moodlenet/kernel'
import { Ext } from '@moodlenet/kernel'
import { pkgDiskInfoOf } from '@moodlenet/kernel/lib/npm-pkg'
import coreExtPkgs from './core-ext-pkg-list'

export default boot
interface BootCfg {
  deploymentFolder: string
}

async function boot({ deploymentFolder }: BootCfg) {
  const { extEnvVars, devMode } = prepareConfigs()
  const K = kernel.core.create({ extEnvVars })
  const pkgMng = kernel.extPkg.makePkgMng({ wd: deploymentFolder })
  await prepareWd()

  return

  async function prepareWd() {
    const initResponse = await pkgMng.initWd()
    if (initResponse === 'first') {
      await initialInstallCoreExtPackages()
      /* const installedCorePkgs = */ await Promise.all(
        coreExtPkgs.map(async coreExtPkg => {
          console.log({ coreExtPkg })
          const pkgDiskInfo = pkgDiskInfoOf(coreExtPkg.pkgId)
          const extPkg = await pkgMng.install(pkgDiskInfo.rootDir)
          return { ...coreExtPkg, extPkg }
        }),
      )
    }

    return await Promise.all(
      coreExtPkgs.flatMap(({ pkgId }) => {
        const pkgDiskInfo = pkgDiskInfoOf(pkgId)

        const exts: Ext[] = pkgMng.require(pkgId).default

        exts.map(ext => K.deployExtension({ ext, pkgDiskInfo }))
      }),
    )
  }

  async function initialInstallCoreExtPackages() {
    return Promise.all(
      coreExtPkgs
        .map(_ => {
          const pkgLocator = devMode ? require.resolve(_.pkgId) : _.pkgId
          return {
            ..._,
            pkgLocator,
          }
        })
        .map(async coreExtPkg => {
          const pkgInfo = pkgDiskInfoOf(coreExtPkg.pkgLocator)
          await pkgMng.install(pkgInfo.rootDir)
        }),
    )
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
