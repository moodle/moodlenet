/// <reference path="../moodlenet-react-app-lib.d.ts" />
import type { CoreExt, Ext, ExtDef } from '@moodlenet/core'
import type { MNHttpServerExt } from '@moodlenet/http-server'
import { mkdir } from 'fs/promises'
import { join, resolve } from 'path'
import { ResolveOptions } from 'webpack'
import VirtualModulesPlugin from 'webpack-virtual-modules'
import { generateCtxProvidersModule } from './generateCtxProvidersModule'
import { generateExposedModule } from './generateExposedModule'
import { generateRoutesModule } from './generateRoutesModule'
import { ExtPluginDef, ExtPluginsMap } from './types'
import { fixModuleLocForWebpackByOS } from './util'
import startWebpack from './webpackWatch'

export * from './types'
// const wpcfg = require('../webpack.config')
// const config: Configuration = wpcfg({}, { mode: 'development' })
const buildFolder = resolve(__dirname, '..', 'build')
const latestBuildFolder = resolve(__dirname, '..', 'latest-build')

export type ReactAppExt = ExtDef<
  'moodlenet.react-app',
  '0.1.10',
  {},
  null,
  {
    setup(_: ExtPluginDef): void
  }
>
const RoutesModuleFile = './src/webapp/routes.ts'
const ExposeModuleFile = './src/react-app-lib/exposedExtModules.ts'
const ExtContextProvidersModuleFile = './src/webapp/extContextProvidersModules.tsx'
const ext: Ext<ReactAppExt, [CoreExt, MNHttpServerExt]> = {
  id: 'moodlenet.react-app@0.1.10',
  displayName: 'webapp',
  requires: ['moodlenet-core@0.1.10', 'moodlenet-http-server@0.1.10'],
  enable(shell) {
    return {
      async deploy(/* { tearDown } */) {
        await mkdir(buildFolder, { recursive: true })
        shell.onExtInstance<MNHttpServerExt>('moodlenet-http-server@0.1.10', (inst /* , depl */) => {
          const { express, mount } = inst
          const mountApp = express()
          const staticWebApp = express.static(latestBuildFolder, {})
          mountApp.use(staticWebApp)
          mountApp.get(`*`, (req, res, next) => {
            if (req.url.startsWith('/_/')) {
              next()
              return
            }
            res.sendFile(join(latestBuildFolder, 'index.html'))
          })
          mount({ mountApp, absMountPath: '/' })
        })

        const extPluginsMap: ExtPluginsMap = {}

        const virtualModulesMap /* : VirtualModulesMap  */ = {
          [RoutesModuleFile]: generateRoutesModule({ extPluginsMap }),
          [ExposeModuleFile]: generateExposedModule({ extPluginsMap }),
          [ExtContextProvidersModuleFile]: generateCtxProvidersModule({ extPluginsMap }),
          '../node_modules/moodlenet-react-app-lib.ts': `
            import lib from '${fixModuleLocForWebpackByOS(resolve(__dirname, '..', 'src', 'react-app-lib'))}'
            export default lib
          `,
        }

        const virtualModules = new VirtualModulesPlugin(virtualModulesMap)
        const baseResolveAlias: ResolveOptions['alias'] = {
          'rxjs': resolve(__dirname, '..', 'node_modules', 'rxjs'),
          'react': resolve(__dirname, '..', 'node_modules', 'react'),
          'react-router-dom': resolve(__dirname, '..', 'node_modules', 'react-router-dom'),
        }

        const wp = await startWebpack({ buildFolder, latestBuildFolder, virtualModules, baseResolveAlias })
        return {
          inst({ depl }) {
            return {
              setup(plugin) {
                console.log('...setup', depl.extId, plugin)
                extPluginsMap[depl.extId] = {
                  ...plugin,
                  extName: depl.extName,
                  extVersion: depl.extVersion,
                  extId: depl.extId,
                }
                // console.log({ '***': wp.compiler.options.resolve.alias })
                if (plugin.addPackageAlias) {
                  const { loc, name } = plugin.addPackageAlias
                  wp.compiler.options.resolve.alias = {
                    ...baseResolveAlias,
                    [name]: loc,
                  }
                }
                const routesModuleContent = generateRoutesModule({ extPluginsMap })
                virtualModules.writeModule(RoutesModuleFile, routesModuleContent)

                const exposedModuleContent = generateExposedModule({ extPluginsMap })
                virtualModules.writeModule(ExposeModuleFile, exposedModuleContent)
                //console.log({exposedModuleContent})

                const ctxProvidersModuleContent = generateCtxProvidersModule({ extPluginsMap })
                virtualModules.writeModule(ExtContextProvidersModuleFile, ctxProvidersModuleContent)
                wp.compiler.watching.invalidate(() => console.log('INVALIDATED'))
              },
            }
          },
        }
      },
    }
  },
}

export default { exts: [ext] }
