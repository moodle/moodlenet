import { plugin } from '@moodlenet/react-app/server'
import type { MyWebAppDeps } from '../../common/my-webapp/types.mjs'
import { expose as myExpose } from '../expose.mjs'
import { shell } from '../shell.mjs'

await shell.call(plugin)<MyWebAppDeps>({
  initModuleLoc: ['dist', 'webapp', 'exports', 'init.js'],
  deps: {
    me: myExpose,
  },
})
