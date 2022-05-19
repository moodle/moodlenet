import type { Ext, ExtDef, KernelExt } from '@moodlenet/kernel'
import type { MNPriHttpExt } from '@moodlenet/pri-http'
import { mkdirSync } from 'fs'
import { rename, rm, stat, writeFile } from 'fs/promises'
import { join, resolve } from 'path'
import { inspect, promisify } from 'util'
import { Configuration, webpack } from 'webpack'

const wpCfg = require('../webpack.config')

const latestBuildFolder = join(__dirname, '..', 'latest-build')
mkdirSync(latestBuildFolder, { recursive: true })
const oldLatestBuildFolder = `${latestBuildFolder}__old`
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
        buildAndClean()
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
                  moduleLoc: depl.pkgDiskInfo.rootDir,
                }
                buildAndClean()
              },
            }
          },
        }
      },
    }
  },
}

export default [extImpl]

async function buildAndClean() {
  await build()
  await removeOldLatestBuildFolder()
}

async function build() {
  console.log('--BUILD WEBAPP')

  const extensionsJsFileName = resolve(__dirname, '..', 'extensions.js' /* 'src', 'webapp', 'extensions.ts' */)
  console.log(`generate extensions.js ....`, { extensionsJsFileName })
  await writeFile(extensionsJsFileName, extensionsJsString(), { encoding: 'utf8' })

  const config: Configuration = wpCfg({}, { mode: 'production', watch: false })
  const webpackAliases = Object.entries(extAliases).reduce(
    (aliases, [extName, { moduleLoc }]) => ({
      ...aliases,
      [extName]: moduleLoc,
    }),
    {},
  )
  config.resolve!.alias = { ...config.resolve!.alias, ...webpackAliases }
  console.log(`Extension aliases ....`, inspect({ /* config,  */ extAliases, webpackAliases }, false, 6, true))

  const wp = webpack(config)
  const runWp = promisify(wp.run.bind(wp))
  const wpStats = await runWp()
  if (wpStats?.hasErrors()) {
    throw new Error(`Webpack build error: ${wpStats.toString()}`)
  }
  console.log(`Webpack build done`)
  const latestBuildFolderStat = await stat(latestBuildFolder)
  await removeOldLatestBuildFolder()
  if (latestBuildFolderStat.isDirectory()) {
    await rename(latestBuildFolder, oldLatestBuildFolder)
  }
  console.log(`renaming output to latestBuildFolder..`)
  await rename(config.output!.path!, latestBuildFolder)
  await removeOldLatestBuildFolder()
  console.log(`build done`)
}

async function removeOldLatestBuildFolder() {
  console.log(`removing oldLatestBuildFolder...`)
  return rm(oldLatestBuildFolder, { maxRetries: 5, retryDelay: 500, force: true, recursive: true })
}

function extensionsJsString() {
  // const requiresAndPush = Object.entries(extAliases)
  //   .map(([pkgName, { cmpPath }]) => `extensions.push( [ '${pkgName}', require('${pkgName}/${cmpPath}').Cmp ] )`)
  //   .join('\n')

  return `  
${Object.entries(extAliases)
  .map(
    ([pkgName, { cmpPath, moduleLoc }]) => `module.exports['${pkgName}']= require('${moduleLoc}/${cmpPath}').default`,
  )
  // .map(([pkgName, { cmpPath }], index) => `export { Cmp as Cmp_${index} } from '${pkgName}/${cmpPath}' //pkgName`)
  .join('\n')}
`
}
