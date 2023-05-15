import { plugin } from '@moodlenet/react-app/server'
import type { MyWebDeps } from '../common/types.mjs'
import { expose as me } from './expose.mjs'
import './persistence/initPersistence.mjs'
import { shell } from './shell.mjs'

shell.call(plugin)<MyWebDeps>({
  initModuleLoc: ['dist', 'webapp', 'exports', 'init.mjs'],
  deps: { me },
})
