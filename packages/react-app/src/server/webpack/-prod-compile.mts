import { cp } from 'fs/promises'
// import { tmpdir } from 'os'
import { resolve } from 'path'
import rimraf from 'rimraf'
import { inspect } from 'util'
import { getWp } from './config.mjs'
import { getBuildContext } from './get-build-context.mjs'

const buildContext = await getBuildContext({ baseBuildFolder: process.cwd() })
const { buildFolder, latestBuildFolder } = buildContext
rimraf.sync(resolve(latestBuildFolder, '*'), { disableGlob: true })
rimraf.sync(resolve(buildFolder, '*'), { disableGlob: true })
const wp = await getWp({
  alias: await buildContext.getAliases(),
  pkgPlugins: await buildContext.getPkgPlugins(),
  mode: 'prod',
  buildFolder,
})

wp.hooks.afterDone.tap('swap folders', async wpStats => {
  if (wpStats?.hasErrors()) {
    errorExit(wpStats.toString())
  }
  await cp(buildFolder, latestBuildFolder, { recursive: true })
  wp.close(() => process.exit(0))
})

function errorExit(err: any) {
  console.error(`Webpack error`, inspect(err, false, 4, true))
  process.exit(1)
}
