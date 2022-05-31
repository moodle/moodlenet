import type { MNHttpServerExt } from '@moodlenet/http-server'
import type { Ext, ExtDef, ExtId, KernelExt, Shell } from '@moodlenet/kernel'
import type { MNPriHttpExt } from '@moodlenet/pri-http'

import { join } from 'path'
import { inspect } from 'util'
import startWebpack, { ExtensionsBag } from './webpackWatch'

// const wpcfg = require('../webpack.config')
// const config: Configuration = wpcfg({}, { mode: 'development' })
const buildFolder = join(__dirname, '..', 'build')
const latestBuildFolder = join(__dirname, '..', 'latest-build')
const extAliases: {
  [extId: string]: { moduleLoc: string; cmpPath: string }
} = {}

export type WebappExt = ExtDef<
  'moodlenet.webapp',
  '0.1.10',
  {},
  null,
  {
    ensureExtension(_: { cmpPath: string }): void
  }
>

/* async function cleanBuildFolders(_: { build?: boolean; latest?: boolean }) {
  return Promise.all([
    _.latest &&
      rm(latestBuildFolder, { recursive: true, force: true }).then(() => mkdir(latestBuildFolder, { recursive: true })),
    _.build && 
    rm(buildFolder, { recursive: true, force: true }).then(() => mkdir(buildFolder, { recursive: true })),
  ])
} */
const extImpl: Ext<WebappExt, [KernelExt, MNPriHttpExt, MNHttpServerExt]> = {
  id: 'moodlenet.webapp@0.1.10',
  displayName: 'webapp',
  requires: ['kernel.core@0.1.10', 'moodlenet.pri-http@0.1.10', 'moodlenet.http-server@0.1.10'],
  enable(shell) {
    return {
      async deploy(/* { tearDown } */) {
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
        const wp = await startWebpack({ buildFolder, latestBuildFolder })
        wp.refresh(generateExtensionsBag(shell))
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
                wp.refresh(generateExtensionsBag(shell))
              },
            }
          },
        }
      },
    }
  },
}

export default [extImpl]

function generateExtensionsBag(shell: Shell<WebappExt>): ExtensionsBag {
  console.log(`generate extensions.ts ....`)

  const extensionsDirectoryModule = makeExtensionsDirectoryModule(shell)
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
//rm(latestBuildFolder, { recursive: true, force: true }).then(() => mkdir(latestBuildFolder, { recursive: true }))
//rm(buildFolder, { recursive: true, force: true }).then(() => mkdir(buildFolder, { recursive: true }))

function makeExtensionsDirectoryModule(shell: Shell<WebappExt>) {
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
