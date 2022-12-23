import { cp } from 'fs/promises'
// import { tmpdir } from 'os'
import { resolve } from 'path'
import { getWp } from './config.mjs'
import rimraf from 'rimraf'
import { buildFolder, latestBuildFolder } from './generated-files.mjs'

const wp = await getWp({ mode: 'prod', buildFolder })
// console.log({ baseResolveAlias, latestBuildFolder, buildFolder })

// process.on('SIGTERM', () => wp.close(() => void 0))

wp.hooks.afterDone.tap('swap folders', async wpStats => {
  console.log(`webpack compiled`)

  if (wpStats?.hasErrors()) {
    throw new Error(`Webpack build error: ${wpStats.toString()}`)
  }
  await new Promise<void>((rimrafResolve, rimrafReject) =>
    rimraf(resolve(latestBuildFolder, '*'), { disableGlob: true }, e =>
      e ? rimrafReject(e) : rimrafResolve(),
    ),
  )
  await cp(buildFolder, latestBuildFolder, { recursive: true })
  wp.close(() => void 0)
})
