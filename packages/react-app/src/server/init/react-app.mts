import type { MyWebAppDeps } from '../../common/exports.mjs'
import { expose as me } from '../expose.mjs'
import { plugin } from '../lib.mjs'
import { shell } from '../shell.mjs'

await shell.call(plugin)<MyWebAppDeps>({
  initModuleLoc: ['dist', 'webapp', 'exports', 'init.mjs'],
  deps: {
    me,
  },
})
