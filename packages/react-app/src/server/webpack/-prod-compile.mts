import { cp } from 'fs/promises'
// import { tmpdir } from 'os'
import { resolve } from 'path'
import rimraf from 'rimraf'
import { inspect } from 'util'
import { getWp } from './config.mjs'
import { buildFolder, latestBuildFolder } from './generated-files.mjs'

const wp = await getWp({ mode: 'prod', buildFolder })
// shell.log('info', { baseResolveAlias, latestBuildFolder, buildFolder })

// process.on('SIGTERM', () => wp.close(() => void 0))

wp.hooks.afterDone.tap('swap folders', async wpStats => {
  if (wpStats?.hasErrors()) {
    errorExit(wpStats.toString())
  }
  await new Promise<void>((rimrafResolve, rimrafReject) =>
    rimraf(resolve(latestBuildFolder, '*'), { disableGlob: true }, e =>
      e ? rimrafReject(e) : rimrafResolve(),
    ),
  )
  await cp(buildFolder, latestBuildFolder, { recursive: true })
  wp.close(() => process.exit(0))
})

function errorExit(err: any) {
  console.error(`Webpack error`, inspect(err, false, 4, true))
  process.exit(1)
}
