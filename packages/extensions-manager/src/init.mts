import type { MyPkgDeps } from './common/types.mjs'
import { plugin } from '@moodlenet/react-app/server'
import shell from './shell.mjs'
import { expose as me } from './expose.mjs'

export * from './types.mjs'

await shell.call(plugin)<MyPkgDeps>({
  pluginDef: {
    mainComponentLoc: ['dist', 'webapp', 'MainComponent.js'],
    deps: { me },
  },
})
