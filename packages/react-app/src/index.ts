/// <reference path="../moodlenet-react-app-lib.d.ts" />
import type { AuthenticationManagerExt } from '@moodlenet/authentication-manager'
import type { CoreExt, Ext, ExtDef, Port, SubTopo } from '@moodlenet/core'
import type { MNHttpServerExtDef } from '@moodlenet/http-server'
import { KeyValueStoreExtDef } from '@moodlenet/key-value-store'

import assert from 'assert'
import { mkdir, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { resolve } from 'path'
import { ResolveOptions } from 'webpack'
import { generateCtxProvidersModule } from './generateCtxProvidersModule'
import { generateExposedModule } from './generateExposedModule'
import { generateRoutesModule } from './generateRoutesModule'
import { AppearanceData, ExtPluginDef, ExtPluginsMap } from './types'
import { fixModuleLocForWebpackByOS } from './util'
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
  },
  setApparence: SubTopo<{ payload: AppearanceData }, { valid: true } | { valid: false }>
  getApparence: SubTopo<void, { data: AppearanceData }>
}
export type ReactAppExt = ExtDef<
  '@moodlenet/react-app',
  '0.1.0',
  {
    setup(_: ExtPluginDef): void
  },
  ReactAppExtTopo
>

export type keyValueData = { appearanceData: AppearanceData }

const tmpDir = resolve(tmpdir(), 'MN-react-app-modules')

const LibModuleFile = { alias: 'moodlenet-react-app-lib', target: resolve(tmpDir, 'lib.ts') }
const ExtRoutesModuleFile = {
  alias: 'ext-routes',
  target: resolve(tmpDir, 'ext-routes.ts'),
}
const ExposeModuleFile = {
  alias: 'ext-exposed-modules',
  target: resolve(tmpDir, 'exposedExtModules.ts'),
}
const ExtContextProvidersModuleFile = {
  alias: 'ext-context-providers-modules',
  target: resolve(tmpDir, 'extContextProvidersModules.tsx'),
}
const ext: Ext<ReactAppExt, [CoreExt, MNHttpServerExtDef, AuthenticationManagerExt, KeyValueStoreExtDef]> = {
  name: '@moodlenet/react-app',
  version: '0.1.0',
  requires: ['@moodlenet/core@0.1.0', '@moodlenet/http-server@0.1.0', '@moodlenet/authentication-manager@0.1.0', '@moodlenet/key-value-store@0.1.0'],
  async connect(shell) {
    const [, http,, kvStorePkg] = shell.deps
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
          'webapp/updated/sub': { validate: () => ({ valid: true }) }
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
        const extPluginsMap: ExtPluginsMap = {}
        await writeAliasModules()
        const baseResolveAlias: ResolveOptions['alias'] = {
          'rxjs': resolve(__dirname, '..', 'node_modules', 'rxjs'),
          'react': resolve(__dirname, '..', 'node_modules', 'react'),
          'react-router-dom': resolve(__dirname, '..', 'node_modules', 'react-router-dom'),
          'react-dom': resolve(__dirname, '..', 'node_modules', 'react-dom'),
          [ExtRoutesModuleFile.alias]: ExtRoutesModuleFile.target,
          [ExposeModuleFile.alias]: ExposeModuleFile.target,
          [ExtContextProvidersModuleFile.alias]: ExtContextProvidersModuleFile.target,
          [LibModuleFile.alias]: LibModuleFile.target,
        }

        const wp = await startWebpack({ buildFolder, latestBuildFolder, baseResolveAlias })
        wp.compiler.hooks.afterDone.tap('recompilation event', _stats => {
          shell.emit('webapp/recompiled')()
        })
        shell.provide.services({
          'webapp/updated'() {
            return shell.msg$.pipe(
              shell.rx.filter(msg =>
                shell.lib.matchMessage<ReactAppExt>()(msg, '@moodlenet/react-app@0.1.0::webapp/recompiled'),
              ),
              shell.rx.map(() => void 0),
            )
          },
          async setApparence(req) {
            const data = await kvStore.set('appearanceData', '', req.payload)
            return { valid: !data || !data.value ? false : true }
          },
          async getApparence() {
            const data = await kvStore.get('appearanceData', '')
            assert(data.value, 'Appearance should be valued')
            return { data: data.value }
          },
        })
        return {
          plug(dep) {
            return {
              setup(plugin) {
                extPluginsMap[dep.shell.extId] = {
                  ...plugin,
                  extName: dep.shell.extName,
                  extVersion: dep.shell.extVersion,
                  extId: dep.shell.extId,
                }
                if (plugin.addPackageAlias) {
                  const { loc, name } = plugin.addPackageAlias
                  wp.compiler.options.resolve.alias = {
                    ...wp.compiler.options.resolve.alias,
                    [name]: loc,
                  }
                }
                writeAliasModulesAndRecompile()
                dep.shell.tearDown.add(() => {
                  if (plugin.addPackageAlias) {
                    const newAliases: any = {
                      ...wp.compiler.options.resolve.alias,
                    }
                    delete newAliases[plugin.addPackageAlias.name]
                    wp.compiler.options.resolve.alias = newAliases
                  }
                  delete extPluginsMap[dep.shell.extId]
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
          return Promise.all([
            writeFile(ExtRoutesModuleFile.target, generateRoutesModule({ extPluginsMap })),
            writeFile(ExposeModuleFile.target, generateExposedModule({ extPluginsMap })),
            writeFile(ExtContextProvidersModuleFile.target, generateCtxProvidersModule({ extPluginsMap })),
            writeFile(
              LibModuleFile.target,
              `
            import lib from '${fixModuleLocForWebpackByOS(resolve(__dirname, '..', 'src', 'react-app-lib'))}'
            export default lib
          `,
            ),
          ])
        }
      },
    }
  },
}

export default ext
