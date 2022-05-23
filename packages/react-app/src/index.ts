import type { Ext, ExtDef, ExtId, KernelExt } from '@moodlenet/kernel'
import { splitExtId } from '@moodlenet/kernel'
import type { MNPriHttpExt } from '@moodlenet/pri-http'
import { mkdirSync, rmSync } from 'fs'
import { cp } from 'fs/promises'
import { join } from 'path'
import { inspect } from 'util'
import { Configuration, webpack } from 'webpack'

const wpcfg = require('../webpack.config')
const config: Configuration = wpcfg({}, { mode: 'development' })

const latestBuildFolder = join(__dirname, '..', 'latest-build')
const buildFolder = join(__dirname, '..', 'build')
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
const extImpl: Ext<WebappExt, [KernelExt, MNPriHttpExt]> = {
  id: 'moodlenet.webapp@0.1.10',
  displayName: 'webapp',
  requires: ['kernel.core@0.1.10', 'moodlenet.pri-http@0.1.10'],
  enable(shell) {
    return {
      deploy(/* { tearDown } */) {
        shell.onExtInstance<MNPriHttpExt>('moodlenet.pri-http@0.1.10', (inst /* , depl */) => {
          const { express, mount } = inst
          const mountApp = express()
          const staticWebApp = express.static(latestBuildFolder, {})
          mountApp.use(staticWebApp)
          mountApp.get('*', (_req, res) => {
            res.sendFile(join(latestBuildFolder, 'index.html'))
          })
          mount({ mountApp, absMountPath: '/' })
        })
        webpackWatch()
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
                generateExtensionListModule()
              },
            }
          },
        }
      },
    }
  },
}

export default [extImpl]

async function generateExtensionListModule() {
  console.log(`generate extensions.ts ....`)

  const extensionsDirectoryModule = makeExtensionsDirectoryModule()
  console.log({ extensionsDirectoryModule })
  wpcfg.virtualModules.writeModule('src/webapp/extensions.ts', extensionsDirectoryModule)

  const webpackAliases = Object.entries(extAliases).reduce(
    (aliases, [extId, { moduleLoc }]) => ({
      ...aliases,
      [extId]: moduleLoc,
    }),
    {},
  )
  config.resolve!.alias = { ...config.resolve!.alias, ...webpackAliases }
  console.log(`Extension aliases ....`, inspect({ /* config,  */ extAliases, webpackAliases }, false, 6, true))
}
//rm(latestBuildFolder, { recursive: true, force: true }).then(() => mkdir(latestBuildFolder, { recursive: true }))
//rm(buildFolder, { recursive: true, force: true }).then(() => mkdir(buildFolder, { recursive: true }))

async function webpackWatch() {
  const wp = webpack(config)

  wp.hooks.beforeCompile.tap('del make build', () => {
    rmSync(buildFolder, { recursive: true, force: true })
    mkdirSync(buildFolder, { recursive: true })
  })
  wp.hooks.shouldEmit.tap('del make latest', () => {
    rmSync(latestBuildFolder, { recursive: true, force: true })
    mkdirSync(latestBuildFolder, { recursive: true })

    return true
  })
  wp.hooks.afterDone.tap('swap folders', async wpStats => {
    if (wpStats?.hasErrors()) {
      throw new Error(`Webpack build error: ${wpStats.toString()}`)
    }
    console.log(`Webpack build done`)
    await cp(config.output!.path!, latestBuildFolder, { recursive: true })
    console.log(`done`)
  })
  wp.hooks.compilation.tap('ExtensionsModulePlugin', (/* compilation */) => {
    wpcfg.virtualModules.writeModule('src/webapp/extensions.ts', makeExtensionsDirectoryModule())
  })
  wp.watch({}, () => {
    console.log(`Webpack watched`)
  })
}

function makeExtensionsDirectoryModule() {
  console.log({ extAliases })
  return `
import { ReactAppExt } from './types'

${Object.entries(extAliases)
  .map(([, { cmpPath, moduleLoc }], index) => `import ext${index} from '${moduleLoc}/${cmpPath}'`)
  .join('\n')}
    
const extensions:Record<string, ReactAppExt> = {
  ${Object.entries(extAliases)
    .map(([extId], index) => {
      const { extName } = splitExtId(extId as ExtId)
      return `
  ['${extName}']:  {
    MainComponent: ext${index},
    extId: '${extId}'
  }`
    })

    .join('\n')}
}
export default extensions
`
}
