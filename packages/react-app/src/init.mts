/// <reference path="../moodlenet-react-app-lib.d.ts" />

import { mkdir, writeFile } from 'fs/promises'
// import { tmpdir } from 'os'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { ResolveOptions } from 'webpack'
import { generateConnectPkgModulesModule } from './generateConnectPkgsModuleModule.mjs'
import { WebappPluginItem } from './types.mjs'
import { httpSrvPkgApis, kvStore } from './use-pkg-apis.mjs'
import startWebpack from './webpackWatch.mjs'

// const wpcfg = require('../webpack.config')
// const config: Configuration = wpcfg({}, { mode: 'development' })
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const buildFolder = resolve(__dirname, '..', 'build')
await mkdir(buildFolder, { recursive: true })
const latestBuildFolder = resolve(__dirname, '..', 'latest-build')

if (!(await kvStore.get('appearanceData', '')).value) {
  await kvStore.set('appearanceData', '', {
    color: '#aaaaaa',
  })
}

// const tmpDir = resolve(tmpdir(), 'MN-react-app-modules')
const connectPkgModulesFile = {
  alias: '_connect-moodlenet-pkg-modules_',
  target: resolve(__dirname, '..', '_connect-moodlenet-pkg-modules_.mjs'),
  // target: resolve(__dirname, '..', '_connect-moodlenet-pkg-modules_.mts'),
  // target: resolve(tmpDir, 'ConnectPkgModules.tsx'),
}

httpSrvPkgApis('mount')({})({
  getApp: function getApp(express) {
    const mountApp = express()
    const staticWebApp = express.static(latestBuildFolder, { index: './public/index.html' })
    mountApp.use(staticWebApp)
    mountApp.get(`*`, (req, res, next) => {
      if (req.url.startsWith('/_/')) {
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
const extPlugins: WebappPluginItem[] = []
const baseResolveAlias: ResolveOptions['alias'] = {
  'rxjs': resolve(__dirname, '..', 'node_modules', 'rxjs'),
  'react': resolve(__dirname, '..', 'node_modules', 'react'),
  'react-router-dom': resolve(__dirname, '..', 'node_modules', 'react-router-dom'),
  // '@moodlenet/react-app/src/webapp/ui': resolve(__dirname, '..', 'src', 'webapp', 'ui'),
  // '@moodlenet/react-app/lib/webapp/ui': resolve(__dirname, '..', 'src', 'webapp', 'ui'),
  'react-dom': resolve(__dirname, '..', 'node_modules', 'react-dom'),
  '@material-ui/icons': '@material-ui/icons/esm',

  // '@moodlenet/authentication-manager/src/*': '@moodlenet/authentication-manager/src/*',
  // '@moodlenet/authentication-manager/lib/*': '@moodlenet/authentication-manager/src/*',

  // '@moodlenet/content-graph/src/*': '@moodlenet/content-graph/src/*',
  // '@moodlenet/content-graph/lib/*': '@moodlenet/content-graph/src/*',

  // '@moodlenet/organization/src/*': '@moodlenet/organization/src/*',
  // '@moodlenet/organization/lib/*': '@moodlenet/organization/src/*',

  // '@moodlenet/http-server/src/*': '@moodlenet/http-server/src/*',
  // '@moodlenet/http-server/lib/*': '@moodlenet/http-server/src/*',

  // '*.mjs': '*.mts',
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
    writeFile(connectPkgModulesFile.target, generateConnectPkgModulesModule({ plugins: extPlugins })),
    writeFile(resolve(__dirname, '..', '_resolve-alias_.json'), JSON.stringify(baseResolveAlias, null, 4)),
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

export async function addWebappPluginItem(webappPluginItem: WebappPluginItem) {
  // console.log({ webappPluginItem })
  extPlugins.push(webappPluginItem)
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
