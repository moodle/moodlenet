import { plugin } from '@moodlenet/react-app/server'
import type { MyWebDeps } from '../common/types.mjs'
import { expose as me } from './expose.mjs'
import shell from './shell.mjs'

await shell.call(plugin)<MyWebDeps>({
  mainComponentLoc: ['dist', 'webapp', 'MainComponent.js'],
  deps: { me },
})
