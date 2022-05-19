import type { Ext, ExtDef, KernelExt } from '@moodlenet/kernel'
import type { MNPriHttpExt } from '@moodlenet/pri-http'
import { mkdirSync } from 'fs'
import { cp } from 'fs/promises'
import { join } from 'path'
import { inspect } from 'util'
import { Configuration, webpack } from 'webpack'

const wpcfg = require('../webpack.config')
const config: Configuration = wpcfg({}, { mode: 'development' })

const latestBuildFolder = join(__dirname, '..', 'latest-build')
mkdirSync(latestBuildFolder, { recursive: true })
// const oldLatestBuildFolder = `${latestBuildFolder}__old`
// const buildFolder = join(__dirname, '..', 'build')
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
        generateExtensionListModule()
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

const wp = webpack(config)
async function generateExtensionListModule() {
  console.log(`generate extensions.ts ....`)

  const extensionsDirectoryModule = makeExtensionsDirectoryModule()
  console.log({ extensionsDirectoryModule })
  wpcfg.virtualModules.writeModule('src/webapp/extensions.ts', extensionsDirectoryModule)

  const webpackAliases = Object.entries(extAliases).reduce(
    (aliases, [extName, { moduleLoc }]) => ({
      ...aliases,
      [extName]: moduleLoc,
    }),
    {},
  )
  config.resolve!.alias = { ...config.resolve!.alias, ...webpackAliases }
  console.log(`Extension aliases ....`, inspect({ /* config,  */ extAliases, webpackAliases }, false, 6, true))
  // wp.compile(_ => {
  //   console.log('--BUILD WEBAPP', _)
  // })
}
// async function generateExtensionListModule() {
//   const extensionsJsFileName = resolve(
//     __dirname,
//     '..',
//     'src',
//     'webapp',
//     'extensions.ts' /* 'src', 'webapp', 'extensions.ts' */,
//   )
//   console.log(`generate extensions.ts ....`, { extensionsJsFileName })
//   await writeFile(extensionsJsFileName, extensionsJsString(), { encoding: 'utf8' })

//   const webpackAliases = Object.entries(extAliases).reduce(
//     (aliases, [extName, { moduleLoc }]) => ({
//       ...aliases,
//       [extName]: moduleLoc,
//     }),
//     {},
//   )
//   config.resolve!.alias = { ...config.resolve!.alias, ...webpackAliases }
//   console.log(`Extension aliases ....`, inspect({ /* config,  */ extAliases, webpackAliases }, false, 6, true))
//   // wp.compile(_ => {
//   //   console.log('--BUILD WEBAPP', _)
//   // })
// }

async function webpackWatch() {
  wp.hooks.afterDone.tap('swap folders', async wpStats => {
    if (wpStats?.hasErrors()) {
      throw new Error(`Webpack build error: ${wpStats.toString()}`)
    }
    console.log(`Webpack build done`)
    await cp(config.output!.path!, latestBuildFolder, { recursive: true })
    console.log(`done`)
  })
  wp.hooks.compilation.tap('ExtensionsModulePlugin', (/* compilation */) => {
    // const extensionsJsFileName = resolve(
    //   __dirname,
    //   '..',
    //   'src',
    //   'webapp',
    //   'extensions.ts' /* 'src', 'webapp', 'extensions.ts' */,
    // )
    // const baseExtensionModule = readFileSync(extensionsJsFileName, { encoding: 'utf8' })
    wpcfg.virtualModules.writeModule('src/webapp/extensions.ts', makeExtensionsDirectoryModule())
  })
  wp.watch({}, () => {
    console.log(`Webpack watched`)
  })
}

function makeExtensionsDirectoryModule() {
  // const requiresAndPush = Object.entries(extAliases)
  //   .map(([pkgName, { cmpPath }]) => `extensions.push( [ '${pkgName}', require('${pkgName}/${cmpPath}').Cmp ] )`)
  //   .join('\n')
  console.log({ extAliases })
  return `
import { ExtCmp } from './types'

${Object.entries(extAliases)
  .map(([, { cmpPath, moduleLoc }], index) => `import ext${index} from '${moduleLoc}/${cmpPath}'`)
  // .map(([pkgName, { cmpPath }], index) => `export { Cmp as Cmp_${index} } from '${pkgName}/${cmpPath}' //pkgName`)
  .join('\n')}
    
const extensions:Record<string, ExtCmp>  = {
  ${Object.entries(extAliases)
    .map(([pkgName], index) => `  ['${pkgName}']:  ext${index}`)
    // .map(([pkgName, { cmpPath }], index) => `export { Cmp as Cmp_${index} } from '${pkgName}/${cmpPath}' //pkgName`)
    .join('\n')}
}
export default extensions
`
}
