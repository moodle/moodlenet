import * as kernel from '@moodlenet/kernel'
import { Ext } from '@moodlenet/kernel'
import { pkgDiskInfoOf } from '@moodlenet/kernel/lib/npm-pkg'
import coreExtPkgs from './core-ext-pkg-list'

export default boot
interface BootCfg {
  deploymentFolder: string
}

async function boot({ deploymentFolder }: BootCfg) {
  console.log('boot', { deploymentFolder })
  const { extEnvVars, devMode } = prepareConfigs()
  const K = kernel.core.create({ extEnvVars })
  const pkgMng = kernel.extPkg.makePkgMng({ wd: deploymentFolder })
  await prepareWd()

  return

  async function prepareWd() {
    const initResponse = await pkgMng.initWd()
    console.log('prepareWd : ', { initResponse })
    if (initResponse === 'first') {
      await initialInstallCoreExtPackages()
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
    const installers = coreExtPkgs
      .map(_ => {
        const pkgLocator = devMode ? require.resolve(_.pkgId) : _.pkgId
        return {
          ..._,
          pkgLocator,
        }
      })
      .map(coreExtPkg => async () => {
        const pkgInfo = pkgDiskInfoOf(coreExtPkg.pkgLocator)
        await pkgMng.install(pkgInfo.rootDir)
      })

    return installers.reduce(
      (prev, next) => () => prev().then(next),
      async () => {},
    )()
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
