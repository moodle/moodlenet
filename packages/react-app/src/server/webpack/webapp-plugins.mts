import { writeFile } from 'fs/promises'
import { createRequire } from 'module'
import { packageDirectorySync } from 'pkg-dir'
// import { tmpdir } from 'os'
import type { ResolveOptions } from 'webpack'
import type { WebappPluginItem, WebPkgDeps } from '../../common/types.mjs'
import { buildContext } from '../build-context.mjs'
import { shell } from '../shell.mjs'
import { generateConnectPkgModulesModule } from './generateConnectPkgsModuleModule.mjs'

const require = createRequire(import.meta.url)

// const tmpDir = resolve(tmpdir(), 'MN-react-app-modules')

const connectPkgModulesFile = {
  alias: '_connect-moodlenet-pkg-modules_',
  target: buildContext.connectPkgModulesFileTarget,
  // target: resolve(__dirname, '..', '_connect-moodlenet-pkg-modules_.mts'),
  // target: resolve(tmpDir, 'ConnectPkgModules.tsx'),
}

const pkgPlugins: WebappPluginItem<any>[] = []
const baseResolveAlias: ResolveOptions['alias'] = {
  'react': packageDirectorySync({ cwd: require.resolve('react') })!,
  'react-router-dom': packageDirectorySync({ cwd: require.resolve('react-router-dom') })!,
  'react-dom': packageDirectorySync({ cwd: require.resolve('react-dom') })!,
  '@material-ui/icons': '@material-ui/icons/esm',

  [connectPkgModulesFile.alias]: connectPkgModulesFile.target,
}
export async function writeGenerated() {
  const generatedConnectPkgModulesModule = generateConnectPkgModulesModule({ plugins: pkgPlugins })
  await Promise.all([
    writeFile(connectPkgModulesFile.target, generatedConnectPkgModulesModule),
    writeFile(buildContext._resolve_alias_json, JSON.stringify(baseResolveAlias, null, 4)),
    writeFile(buildContext._pkg_plugins_json, JSON.stringify(pkgPlugins, null, 4)),
  ])
  return {
    generatedConnectPkgModulesModule,
    baseResolveAlias,
    pkgPlugins,
  }
}

export function addWebappPluginItem<Deps extends WebPkgDeps = never>(
  webappPluginItem: WebappPluginItem<Deps>,
) {
  pkgPlugins[webappPluginItem.guestPkgId === shell.myId ? 'unshift' : 'push'](webappPluginItem)
}
