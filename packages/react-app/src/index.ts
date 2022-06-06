import type { MNHttpServerExt } from '@moodlenet/http-server'
import type { Ext, ExtDef, ExtId, KernelExt } from '@moodlenet/kernel'
import type { MNPriHttpExt } from '@moodlenet/pri-http'
import { mkdir } from 'fs/promises'

import { join, resolve } from 'path'
import { inspect } from 'util'
import startWebpack, { ExtensionsBag } from './webpackWatch'

export * from './types'
// const wpcfg = require('../webpack.config')
// const config: Configuration = wpcfg({}, { mode: 'development' })
const buildFolder = resolve(__dirname, '..', 'build')
const latestBuildFolder = resolve(__dirname, '..', 'latest-build')
const extAliases: {
  [extId: string]: { moduleLoc: string; cmpPath: string }
} = {}

export type ReactAppExt = ExtDef<
  'moodlenet.react-app',
  '0.1.10',
  {},
  null,
  {
    ensureExtension(_: { cmpPath: string }): void
  }
>

const extImpl: Ext<ReactAppExt, [KernelExt, MNPriHttpExt, MNHttpServerExt]> = {
  id: 'moodlenet.react-app@0.1.10',
  displayName: 'webapp',
  requires: ['moodlenet.kernel@0.1.10', 'moodlenet.pri-http@0.1.10', 'moodlenet.http-server@0.1.10'],
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
        const wp = await startWebpack({ buildFolder, latestBuildFolder, getExtensionsBag })
        return {
          inst({ depl }) {
            return {
              ensureExtension({ cmpPath }) {
                console.log('....ensureExtension', depl.extId, cmpPath)
                if (!depl.pkgDiskInfo) {
                  throw new Error(`ensureExtension: extId ${depl.extId} not deployed`)
                }
                extAliases[depl.extId] = {
                  cmpPath,
                  moduleLoc: depl.pkgDiskInfo.rootDirPosix,
                }
                wp.reconfigExtAndAliases()
              },
            }
          },
        }

        function getExtensionsBag(): ExtensionsBag {
          console.log(`generate extensions.ts ..`)

          const extensionsDirectoryModule = makeExtensionsDirectoryModule()
          console.log({ extensionsDirectoryModule })

          const webpackAliases = Object.entries(extAliases).reduce(
            (aliases, [extId, { moduleLoc }]) => ({
              ...aliases,
              [extId]: moduleLoc,
            }),
            {},
          )
          console.log(`Extension aliases ....`, inspect({ /* config,  */ extAliases, webpackAliases }, false, 6, true))
          return { extensionsDirectoryModule, webpackAliases }
        }

        function makeExtensionsDirectoryModule() {
          console.log({ extAliases })
          return `
import { ReactAppExt } from './types'

${Object.entries(extAliases)
  .map(([, { cmpPath, moduleLoc }], index) => `import ext${index} from '${moduleLoc}/${cmpPath}'`)
  .join('\n')}
    
const extensions:Record<string, ReactAppExt<any>> = {
  ${Object.entries(extAliases)
    .map(([extId], index) => {
      const { extName, version } = shell.lib.splitExtId(extId as ExtId)
      return `
  ['${extName}']:  {
    main: ext${index},
    version: '${version}',
    extName: '${extName}'
  }`
    })

    .join('\n')}
}
export default extensions
`
        }
      },
    }
  },
}

export default [extImpl]
