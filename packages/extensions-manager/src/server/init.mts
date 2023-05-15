import { plugin } from '@moodlenet/react-app/server'
import type { MyPkgDeps } from '../common/types.mjs'
import { expose as me } from './expose.mjs'
import { shell } from './shell.mjs'

await shell.call(plugin)<MyPkgDeps>({
  initModuleLoc: ['dist', 'webapp', 'exports/init.mjs'],
  deps: { me },
})
