import { mkdir } from 'fs/promises'
import type { MyWebAppDeps } from '../../common/exports.mjs'
import { buildContext } from '../build-context.mjs'
import { expose as me } from '../expose.mjs'
import { plugin } from '../lib.mjs'
import { shell } from '../shell.mjs'

await shell.call(plugin)<MyWebAppDeps>({
  initModuleLoc: ['dist', 'webapp', 'exports', 'init.mjs'],
  deps: {
    me,
  },
})

await mkdir(buildContext.baseBuildFolder, { recursive: true })
await mkdir(buildContext.latestBuildFolder, { recursive: true })
