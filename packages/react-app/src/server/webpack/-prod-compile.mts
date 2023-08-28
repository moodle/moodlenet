import { cpSync } from 'fs'
import { mkdtemp } from 'fs/promises'
import { tmpdir } from 'os'
import { join, resolve } from 'path'
import rimraf from 'rimraf'
import { inspect } from 'util'
import { getWp } from './config.mjs'
import { getBuildContext } from './get-build-context.mjs'

const baseBuildFolder = process.cwd()
const buildFolder_tmp = await mkdtemp(join(tmpdir(), 'moodlenet-webapp-build-'))
const buildContext = await getBuildContext({ baseBuildFolder })

rimraf.sync(resolve(buildContext.latestBuildFolder, '*'), { disableGlob: true })

const wp = getWp({
  alias: await buildContext.getAliases(),
  pkgPlugins: await buildContext.getPkgPlugins(),
  mode: 'prod',
  buildFolder: buildFolder_tmp,
})

wp.hooks.done.tap('copy build in latest build folder', async wpStats => {
  if (wpStats?.hasErrors()) {
    console.error(`Webpack error`, inspect(wpStats, false, 4, true))
    process.exit(1)
  }
  console.log(
    `Webpack compilation done`,
    wpStats.toString(),
    `copying from ${buildFolder_tmp} to ${buildContext.latestBuildFolder}`,
  )

  cpSync(buildFolder_tmp, buildContext.latestBuildFolder, { recursive: true })
  wp.close(() => process.exit(0))
})
