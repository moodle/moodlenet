import type { CoreExt, Ext, ExtDef } from '@moodlenet/core'
import type { MNHttpServerExt } from '@moodlenet/http-server'
import { mkdir } from 'fs/promises'

import { join, resolve } from 'path'
import startWebpack, { ExtensionsBag } from './webpackWatch'

export * from './types'
// const wpcfg = require('../webpack.config')
// const config: Configuration = wpcfg({}, { mode: 'development' })
const buildFolder = resolve(__dirname, '..', 'build')
const latestBuildFolder = resolve(__dirname, '..', 'latest-build')
const extAliases: {
  [extId: string]: { moduleLoc: string }
} = {}

export type ReactAppExt = ExtDef<
  'moodlenet.react-app',
  '0.1.10',
  {},
  null,
  {
    ensureExtension(_: { moduleLoc: string }): void
  }
>

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
        const wp = await startWebpack({ buildFolder, latestBuildFolder, getExtensionsBag })
        return {
          inst({ depl }) {
            return {
              ensureExtension({ moduleLoc }) {
                console.log('....ensureExtension', depl.extId, moduleLoc)
                if (!depl.pkgInfo) {
                  throw new Error(`ensureExtension: extId ${depl.extId} not deployed`)
                }
                extAliases[depl.extId] = {
                  moduleLoc,
                }
                wp.reconfigExtAndAliases()
              },
            }
          },
        }

        function getExtensionsBag(): ExtensionsBag {
          console.log(`generate extensions.ts ..`)

          const extensionsDirectoryModule = makeExtensionsDirectoryModule()
          // console.log({ extensionsDirectoryModule })

          const webpackAliases = Object.entries(extAliases).reduce(
            (aliases, [extId, { moduleLoc }]) => ({
              ...aliases,
              [extId]: moduleLoc,
            }),
            {},
          )
          // console.log(`Extension aliases ....`, inspect({ /* config,  */ extAliases, webpackAliases }, false, 6, true))
          return { extensionsDirectoryModule, webpackAliases }
        }

        function makeExtensionsDirectoryModule() {
          console.log({ extAliases })
          return `
import { ReactAppExt } from './types'

${Object.values(extAliases)
  .map(({ moduleLoc }, index) => `import ext${index} from '${moduleLoc}'`)
  .join('\n')}

const extensions: ReactAppExt[] = [
  ${Object.entries(extAliases)
    .map(([extId], index) => {
      return `
    {
    main: ext${index},
    extId: '${extId}',
  }`
    })
    .join('\n')}
]
export default extensions
`
        }
      },
    }
  },
}

export default { exts: [ext] }
