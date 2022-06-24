import type { CoreExt, Ext, ExtDef, ExtId, ExtName, ExtVersion } from '@moodlenet/core'
import type { MNHttpServerExt } from '@moodlenet/http-server'
import { mkdir } from 'fs/promises'

import { join, resolve } from 'path'
import VirtualModulesPlugin from 'webpack-virtual-modules'
import startWebpack from './webpackWatch'

export * from './types'
// const wpcfg = require('../webpack.config')
// const config: Configuration = wpcfg({}, { mode: 'development' })
const buildFolder = resolve(__dirname, '..', 'build')
const latestBuildFolder = resolve(__dirname, '..', 'latest-build')

type ModuleRouteDef = { moduleLoc: string; rootPath?: string }
export type ReactAppExt = ExtDef<
  'moodlenet.react-app',
  '0.1.10',
  {},
  null,
  {
    setModuleRoutes(_: ModuleRouteDef): void
  }
>
const RoutesModuleFile = './src/webapp/routes.ts'
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

        const moduleRoutes: Record<ExtId, { routeDef: ModuleRouteDef; extName: ExtName; extVersion: ExtVersion }> = {}

        const virtualModulesMap /* : VirtualModulesMap  */ = {
          [RoutesModuleFile]: generateRoutesVirtualModuleContent(),
          '../node_modules/moodlenet-react-app-lib.ts': `
            import def from '${resolve(__dirname, 'react-app-lib')}'
            export default def
          `,
        }

        const virtualModules = new VirtualModulesPlugin(virtualModulesMap)
        const wp = await startWebpack({ buildFolder, latestBuildFolder, virtualModules })
        return {
          inst({ depl }) {
            return {
              setModuleRoutes(routeDef) {
                console.log('...setModuleRoutes', depl.extName, routeDef)
                moduleRoutes[depl.extId] = {
                  routeDef,
                  extName: depl.extName,
                  extVersion: depl.extVersion,
                }
                const routesModuleContent = generateRoutesVirtualModuleContent()
                virtualModules.writeModule(RoutesModuleFile, routesModuleContent)
                wp.compiler.watching.invalidate(() => console.log('INVALIDATED'))
              },
            }
          },
        }

        function generateRoutesVirtualModuleContent() {
          console.log(`generate routes.ts ..`)

          return `
import { lazy } from 'react'
type RoutePath = string
const routes: ModRoute[]= [
  ${Object.entries(moduleRoutes)
    .map(
      ([
        extId,
        {
          extName,
          extVersion,
          routeDef: { moduleLoc, rootPath },
        },
      ]) => {
        //const modRoute:ModRoute={}
        return `
  {
    rootPath: '${rootPath}',
    extName: '${extName}',
    extVersion:'${extVersion}',
    extId:'${extId}',
    extRoutingElement: require('${moduleLoc}').default,
  }
`
      },
    )
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
