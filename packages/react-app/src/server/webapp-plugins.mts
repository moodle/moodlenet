import { writeFile } from 'fs/promises'
import { createRequire } from 'module'
import { packageDirectorySync } from 'pkg-dir'
// import { tmpdir } from 'os'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import type { ResolveOptions } from 'webpack'
import type { WebappPluginItem, WebPkgDeps } from '../common/types.mjs'
import { generateConnectPkgModulesModule } from './generateConnectPkgsModuleModule.mjs'
import shell from './shell.mjs'

// const wpcfg = require('../webpack.config')
// const config: Configuration = wpcfg({}, { mode: 'development' })
const require = createRequire(import.meta.url)

const __dirname = fileURLToPath(new URL('.', import.meta.url))
// const tmpDir = resolve(tmpdir(), 'MN-react-app-modules')
const connectPkgModulesFile = {
  alias: '_connect-moodlenet-pkg-modules_',
  target: resolve(__dirname, '..', '..', '_connect-moodlenet-pkg-modules_.mjs'),
  // target: resolve(__dirname, '..', '_connect-moodlenet-pkg-modules_.mts'),
  // target: resolve(tmpDir, 'ConnectPkgModules.tsx'),
}

// await mkdir(tmpDir, { recursive: true })
const pkgPlugins: WebappPluginItem<any>[] = []
const baseResolveAlias: ResolveOptions['alias'] = {
  'react': packageDirectorySync({ cwd: require.resolve('react') })!,
  'react-router-dom': packageDirectorySync({ cwd: require.resolve('react-router-dom') })!,
  'react-dom': packageDirectorySync({ cwd: require.resolve('react-dom') })!,
  '@material-ui/icons': '@material-ui/icons/esm',

  [connectPkgModulesFile.alias]: connectPkgModulesFile.target,
}
export function writeGenerated() {
  return Promise.all([
    writeFile(
      connectPkgModulesFile.target,
      generateConnectPkgModulesModule({ plugins: pkgPlugins }),
    ),
    writeFile(
      resolve(__dirname, '..', '..', '_resolve-alias_.json'),
      JSON.stringify(baseResolveAlias, null, 4),
    ),
    writeFile(
      resolve(__dirname, '..', '..', '_pkg_plugins_.json'),
      JSON.stringify(pkgPlugins, null, 4),
    ),
  ])
}

export function addWebappPluginItem<Deps extends WebPkgDeps = never>(
  webappPluginItem: WebappPluginItem<Deps>,
) {
  pkgPlugins[webappPluginItem.guestPkgId === shell.myId ? 'unshift' : 'push'](webappPluginItem)
}
