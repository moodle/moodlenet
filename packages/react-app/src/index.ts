import type { CoreExt, Ext, ExtDef } from '@moodlenet/core'
import type { MNHttpServerExt } from '@moodlenet/http-server'
import { mkdir } from 'fs/promises'

import { join, resolve } from 'path'
import VirtualModulesPlugin from 'webpack-virtual-modules'
import { ExtPluginDef, ExtPluginsMap } from './types'
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
const ExposeModuleFile = './lib/react-app-lib/exposedExtModules.ts'
const ext: Ext<ReactAppExt, [CoreExt, MNHttpServerExt]> = {
  id: 'moodlenet.react-app@0.1.10',
  displayName: 'webapp',
  requires: ['moodlenet-core@0.1.10', 'moodlenet.http-server@0.1.10'],
  enable(shell) {
    return {
      async deploy(/* { tearDown } */) {
        await mkdir(buildFolder, { recursive: true })
        shell.onExtInstance<MNHttpServerExt>('moodlenet.http-server@0.1.10', (inst /* , depl */) => {
          const { express, mount } = inst
          const mountApp = express()
          const staticWebApp = express.static(latestBuildFolder, {})
          mountApp.use(staticWebApp)
          mountApp.get('*', (_req, res) => {
            res.sendFile(join(latestBuildFolder, 'index.html'))
          })
          mount({ mountApp, absMountPath: '/' })
        })

        const extPluginsMap: ExtPluginsMap = {}

        const virtualModulesMap /* : VirtualModulesMap  */ = {
          [RoutesModuleFile]: generateRoutesVirtualModuleContent(),
          [ExposeModuleFile]: generateExposed(),
          '../node_modules/moodlenet-react-app-lib.ts': `
            import lib from '${resolve(__dirname, 'react-app-lib')}'
            export default lib
          `,
        }

        const virtualModules = new VirtualModulesPlugin(virtualModulesMap)
        const wp = await startWebpack({ buildFolder, latestBuildFolder, virtualModules })
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

                const routesModuleContent = generateRoutesVirtualModuleContent()
                virtualModules.writeModule(RoutesModuleFile, routesModuleContent)

                const exposedModuleContent = generateExposed()
                virtualModules.writeModule(ExposeModuleFile, exposedModuleContent)

                wp.compiler.watching.invalidate(() => console.log('INVALIDATED'))
              },
            }
          },
        }

        function generateExposed() {
          console.log(`generate exposed.ts ..`)

          return `// - generated -
const exp: Record<string, any> = {
  ${Object.values(extPluginsMap)
    .map(extPlugin => {
      return !extPlugin.expose
        ? null
        : `
  '${extPlugin.extName}': require('${extPlugin.expose.moduleLoc}').default
    `
    })
    .filter(Boolean)
    .join(',\n')}
}
//module.exports=exp
export default exp
`
        }

        function generateRoutesVirtualModuleContent() {
          console.log(`generate routes.ts ..`)

          return `// - generated -
import { lazy } from 'react'
const routes: ExtRoute[]= [
  ${Object.values(extPluginsMap)
    .map(extPlugin => {
      return !extPlugin.routes
        ? null
        : `
  {
    rootPath: '${extPlugin.routes.rootPath}',
    extName: '${extPlugin.extName}',
    extVersion:'${extPlugin.extVersion}',
    extId:'${extPlugin.extId}',
    extRoutingElement: require('${extPlugin.routes.moduleLoc}').default,
  }
`
    })
    .filter(Boolean)
    .join(',\n')}
]
export default routes
          
`
        }
      },
    }
  },
}

export default { exts: [ext] }
