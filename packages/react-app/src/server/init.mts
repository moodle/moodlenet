import { mkdir, writeFile } from 'fs/promises'
import { createRequire } from 'module'
import { packageDirectorySync } from 'pkg-dir'
// import { tmpdir } from 'os'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { ResolveOptions } from 'webpack'
import { defaultAppearanceData } from '../common/appearance/data.mjs'
import { WebappPluginItem } from '../common/types.mjs'
import { WebPkgDepList } from '../webapp/web-lib.mjs'
import { generateConnectPkgModulesModule } from './generateConnectPkgsModuleModule.mjs'
import { httpSrvPkg, kvStore } from './use-pkgs.mjs'
import startWebpack from './webpackWatch.mjs'

// const wpcfg = require('../webpack.config')
// const config: Configuration = wpcfg({}, { mode: 'development' })
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const require = createRequire(import.meta.url)

const buildFolder = resolve(__dirname, '..', '..', 'build')
await mkdir(buildFolder, { recursive: true })
const latestBuildFolder = resolve(__dirname, '..', '..', 'latest-build')

if (!(await kvStore.get('appearanceData', '')).value) {
  await kvStore.set('appearanceData', '', defaultAppearanceData)
}

// const tmpDir = resolve(tmpdir(), 'MN-react-app-modules')
const connectPkgModulesFile = {
  alias: '_connect-moodlenet-pkg-modules_',
  target: resolve(__dirname, '..', '..', '_connect-moodlenet-pkg-modules_.mjs'),
  // target: resolve(__dirname, '..', '_connect-moodlenet-pkg-modules_.mts'),
  // target: resolve(tmpDir, 'ConnectPkgModules.tsx'),
}

httpSrvPkg.api('mount')({
  getApp(express) {
    const mountApp = express()
    const staticWebApp = express.static(latestBuildFolder, { index: './index.html' })
    mountApp.use(staticWebApp)
    mountApp.get(`*`, (req, res, next) => {
      if (req.url.startsWith('/.')) {
        next()
        return
      }
      res.sendFile(resolve(latestBuildFolder, 'index.html'))
    })
    return mountApp
  },
  mountOnAbsPath: '/',
})

// await mkdir(tmpDir, { recursive: true })
const pkgPlugins: WebappPluginItem<any>[] = []
const baseResolveAlias: ResolveOptions['alias'] = {
  'react': packageDirectorySync({ cwd: require.resolve('react') })!,
  'react-router-dom': packageDirectorySync({ cwd: require.resolve('react-router-dom') })!,
  'react-dom': packageDirectorySync({ cwd: require.resolve('react-dom') })!,
  '@material-ui/icons': '@material-ui/icons/esm',

  [connectPkgModulesFile.alias]: connectPkgModulesFile.target,
}
await writeGenerated()
const wp = startWebpack({ buildFolder, latestBuildFolder, baseResolveAlias })
// wp.compiler.hooks.afterDone.tap('recompilation event', _stats => {
//   emit('webapp/recompiled')()
// })

export async function writeGeneratedAndRecompile() {
  await writeGenerated()
  recompile()
}

function recompile() {
  wp.compiler.watching.invalidate(() => {
    /* console.log('INVALIDATED') */
  })
}

function writeGenerated() {
  // console.log('connectPkgModulesModule', connectPkgModulesModule)
  return Promise.all([
    writeFile(
      connectPkgModulesFile.target,
      generateConnectPkgModulesModule({ plugins: pkgPlugins }),
    ),
    writeFile(
      resolve(__dirname, '..', '..', '_resolve-alias_.json'),
      JSON.stringify(baseResolveAlias, null, 4),
    ),
  ])
  // return Promise.all([
  // writeFile(ExtRoutesModuleFile.target, generateRoutesModule({ extPluginsMap: extPlugins })),
  // writeFile(ExposeModuleFile.target, generateExposedModule({ extPluginsMap: extPlugins })),
  // writeFile(ExtContextProvidersModuleFile.target, generateCtxProvidersModule({ extPluginsMap: extPlugins })),
  //   writeFile(
  //     LibModuleFile.target,
  //     `
  //   import lib from '${fixModuleLocForWebpackByOS(resolve(__dirname, '..', 'src', 'react-app-lib'))}'
  //   export default lib
  // `,
  //   ),
  // ])
}

export async function addWebappPluginItem<Deps extends WebPkgDepList = never>(
  webappPluginItem: WebappPluginItem<Deps>,
) {
  // console.log({ webappPluginItem })
  pkgPlugins.push(webappPluginItem)
  // const scopedLibFilename = resolve(tmpDir, `react-app-lib__${dep.shell.extName}.ts`)
  // const scopedReactAppLibString = generateReactAppLibScopedModule({
  //   deps: dep.shell.deps.map(_ => _.access._target),
  //   extId: dep.shell.extId,
  //   extName: dep.shell.extName,
  //   extVersion: dep.shell.extVersion,
  //   pkgMainModulesFile: pkgMainModulesFile.target,
  // })
  // console.log({ scopedLibFilename, scopedReactAppLibString })
  // await writeFile(scopedLibFilename, scopedReactAppLibString, { encoding: 'utf-8' })
  // const scopedLibModuleAliasName = `${dep.shell.baseFolder}/node_modules`
  // wp.compiler.options.resolve.alias = {
  //   ...wp.compiler.options.resolve.alias,
  //   [scopedLibModuleAliasName]: scopedLibFilename,
  // }
  await writeGeneratedAndRecompile()

  //FIXME:
  // TODO: remove?
  // dep.shell.tearDown.add(async () => {
  //   // await rm(scopedLibFilename)
  //   // delete (wp.compiler.options.resolve.alias as any)[scopedLibModuleAliasName]
  //   extPlugins.splice(extPlugins.indexOf(extPluginItem), 1)
  //   writeGeneratedAndRecompile()
  // })
}
