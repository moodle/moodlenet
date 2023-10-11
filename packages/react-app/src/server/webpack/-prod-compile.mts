import { cpSync } from 'fs'
import { mkdtemp } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { inspect } from 'util'
import { getWp } from './config.mjs'
import { getBuildContext } from './get-build-context.mjs'

const baseBuildFolder = process.cwd()
const buildFolder_tmp = await mkdtemp(join(tmpdir(), 'moodlenet-webapp-build-'))
const buildContext = await getBuildContext({ baseBuildFolder })
const alias = await buildContext.getAliases()
const pkgPlugins = await buildContext.getPkgPlugins()
// console.log({ buildContext, alias, pkgPlugins })
const wp = getWp({
  alias,
  pkgPlugins,
  mode: 'prod',
  buildFolder: buildFolder_tmp,
})

wp.hooks.done.tap('copy build in latest build folder', async wpStats => {
  if (wpStats?.hasErrors()) {
    console.error(`Webpack error`, inspect(wpStats.toString(), false, 4, true))
    process.exit(1)
  }
  console.log(
    `Webpack compilation done`,
    wpStats.toString(),
    `copying from ${buildFolder_tmp} to ${buildContext.latestBuildFolder}`,
  )

  cpSync(buildFolder_tmp, buildContext.latestBuildFolder, { recursive: true })
  process.exit(0)
})
