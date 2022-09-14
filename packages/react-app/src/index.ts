/// <reference path="../moodlenet-react-app-lib.d.ts" />
import type { AuthenticationManagerExtDef } from '@moodlenet/authentication-manager'
import type { CoreExt, Ext, ExtDef, Port, SubTopo } from '@moodlenet/core'
import type { MNHttpServerExtDef } from '@moodlenet/http-server'
import { KeyValueStoreExtDef } from '@moodlenet/key-value-store'

import assert from 'assert'
import { mkdir, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { resolve } from 'path'
import { ResolveOptions } from 'webpack'
import { generateConnectPkgModulesModule } from './generateConnectPkgsModuleModule'
import { AppearanceData, WebappPluginDef, WebappPluginItem } from './types'
import startWebpack from './webpackWatch'

export * from './types'
// const wpcfg = require('../webpack.config')
// const config: Configuration = wpcfg({}, { mode: 'development' })
const buildFolder = resolve(__dirname, '..', 'build')
const latestBuildFolder = resolve(__dirname, '..', 'latest-build')

export type ReactAppExtTopo = {
  webapp: {
    updated: SubTopo<void, void>
    recompiled: Port<'out', void>
  }
  setApparence: SubTopo<{ payload: AppearanceData }, { valid: true } | { valid: false }>
  getApparence: SubTopo<void, { data: AppearanceData }>
}
export type ReactAppExtDef = ExtDef<
  '@moodlenet/react-app',
  '0.1.0',
  {
    setup(_: WebappPluginDef): void
  },
  ReactAppExtTopo
>

export type keyValueData = { appearanceData: AppearanceData }
const tmpDir = resolve(tmpdir(), 'MN-react-app-modules')
const connectPkgModulesFile = {
  alias: '_connect-moodlenet-pkg-modules_',
  target: resolve(tmpDir, 'ConnectPkgModules.tsx'),
}
export type ReactAppExt = Ext<
  ReactAppExtDef,
  [CoreExt, MNHttpServerExtDef, AuthenticationManagerExtDef, KeyValueStoreExtDef]
>
const ext: ReactAppExt = {
  name: '@moodlenet/react-app',
  version: '0.1.0',
  requires: [
    '@moodlenet/core@0.1.0',
    '@moodlenet/http-server@0.1.0',
    '@moodlenet/authentication-manager@0.1.0',
    '@moodlenet/key-value-store@0.1.0',
  ],
  async connect(shell) {
    const [, http, , kvStorePkg] = shell.deps
    const kvStore = await kvStorePkg.plug.getStore<keyValueData>()

    return {
      async install() {
        //
        await kvStore.set('appearanceData', '', {
          color: '#aaaaaa',
        })
      },

      async deploy() {
        shell.expose({
          // http://localhost:8080/_/_/raw-sub/moodlenet-organization/0.1.10/_test  body:{"paramIn2": "33"}
          'getApparence/sub': {
            validate(/* data */) {
              return { valid: true }
            },
          },
          'setApparence/sub': {
            validate(/* data */) {
              return { valid: true }
            },
          },
          'webapp/updated/sub': { validate: () => ({ valid: true }) },
        })

        http.plug.mount({ getApp, absMountPath: '/' })
        function getApp() {
          const mountApp = http.plug.express()
          const staticWebApp = http.plug.express.static(latestBuildFolder, { index: './public/index.html' })
          mountApp.use(staticWebApp)
          mountApp.get(`*`, (req, res, next) => {
            if (req.url.startsWith('/_/')) {
              next()
              return
            }
            res.sendFile(resolve(latestBuildFolder, './public/index.html'))
          })
          return mountApp
        }

        await mkdir(tmpDir, { recursive: true })
        await mkdir(buildFolder, { recursive: true })
        const extPlugins: WebappPluginItem[] = []
        const baseResolveAlias: ResolveOptions['alias'] = {
          'rxjs': resolve(__dirname, '..', 'node_modules', 'rxjs'),
          'react': resolve(__dirname, '..', 'node_modules', 'react'),
          'react-router-dom': resolve(__dirname, '..', 'node_modules', 'react-router-dom'),
          'react-dom': resolve(__dirname, '..', 'node_modules', 'react-dom'),
          [connectPkgModulesFile.alias]: connectPkgModulesFile.target,
        }
        await writeAliasModules()
        const wp = await startWebpack({ buildFolder, latestBuildFolder, baseResolveAlias })
        wp.compiler.hooks.afterDone.tap('recompilation event', _stats => {
          shell.emit('webapp/recompiled')()
        })
        shell.provide.services({
          'webapp/updated'() {
            return shell.msg$.pipe(
              shell.rx.filter(msg =>
                shell.lib.matchMessage<ReactAppExtDef>()(msg, '@moodlenet/react-app@0.1.0::webapp/recompiled'),
              ),
              shell.rx.map(() => void 0),
            )
          },
          async 'setApparence'(req) {
            const data = await kvStore.set('appearanceData', '', req.payload)
            return { valid: !data || !data.value ? false : true }
          },
          async 'getApparence'() {
            const data = await kvStore.get('appearanceData', '')
            assert(data.value, 'Appearance should be valued')
            return { data: data.value }
          },
        })
        return {
          plug(dep) {
            return {
              async setup(plugin) {
                const extPluginItem: WebappPluginItem = {
                  ...plugin,
                  guestShell: dep.shell,
                }
                extPlugins.push(extPluginItem)
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
                await writeAliasModulesAndRecompile()
                dep.shell.tearDown.add(async () => {
                  // await rm(scopedLibFilename)
                  // delete (wp.compiler.options.resolve.alias as any)[scopedLibModuleAliasName]
                  extPlugins.splice(extPlugins.indexOf(extPluginItem), 1)
                  writeAliasModulesAndRecompile()
                })
              },
            }
          },
        }
        async function writeAliasModulesAndRecompile() {
          await writeAliasModules()
          wp.compiler.watching.invalidate(() => {
            /* console.log('INVALIDATED') */
          })
        }
        function writeAliasModules() {
          const connectPkgModulesModule = generateConnectPkgModulesModule({ extPlugins })
          console.log('connectPkgModulesModule', connectPkgModulesModule)
          return writeFile(connectPkgModulesFile.target, connectPkgModulesModule)
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
      },
    }
  },
}

export default ext
