import { CoreExt, Ext, ExtDef, ExtId, splitExtId } from '@moodlenet/core'
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

type ModuleRouteDef = { moduleLoc: string; label: string; path?: string }
export type ReactAppExt = ExtDef<
  'moodlenet.react-app',
  '0.1.10',
  {},
  null,
  {
    setModuleRoutes(_: ModuleRouteDef[]): void
  }
>

type VirtualModulesMap = {
  './src/webapp/routes.ts': string
}
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

        const moduleRoutes: Record<ExtId, { routes: ModuleRouteDef[] }> = {}

        const virtualModulesMap: VirtualModulesMap = {
          './src/webapp/routes.ts': generateRoutesVirtualModuleContent(),
        }

        const virtualModules = new VirtualModulesPlugin(virtualModulesMap)

        const wp = await startWebpack({ buildFolder, latestBuildFolder, virtualModules })
        return {
          inst({ depl }) {
            return {
              setModuleRoutes(routes) {
                console.log('...setModuleRoutes', depl.extId, routes)
                moduleRoutes[depl.extId] = { routes }
                const routesModuleContent = generateRoutesVirtualModuleContent()
                const routesModule: keyof VirtualModulesMap = './src/webapp/routes.ts'
                virtualModules.writeModule(routesModule, routesModuleContent)
                wp.compiler.watching.invalidate(() => console.log('INVALIDATED'))
              },
            }
          },
        }

        function generateRoutesVirtualModuleContent() {
          console.log(`generate routes.ts ..`)

          return `
import { lazy } from 'react'
import { PathRouteProps } from 'react-router-dom'
type RoutePath = string
const routes: Record<RoutePath, {props:PathRouteProps}> = [
  ${Object.entries(moduleRoutes)
    .flatMap(([extId, { routes }]) => {
      return routes.map(moduleRouteDef => {
        const { label, moduleLoc, path: _mPath } = moduleRouteDef
        const { extName } = splitExtId(extId as ExtId)
        const path = _mPath ?? `${extName}/${label}`
        return `
  {
    extId:'${extId}',
    path:'${path}',
    Component: lazy(() => import('${moduleLoc}'))
  }
`
      })
    })
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
