import { plugin } from '@moodlenet/react-app/server'
import assert from 'assert'
import { shell } from './shell.mjs'

export const expose = await shell.expose({
  rpc: {
    'hello/world': {
      guard: body => {
        assert(
          typeof body?.stringParam === 'string' && typeof body?.numberParam === 'number',
          'invalid params',
        )
      },
      fn: async body => {
        return {
          msg: `Hello world`,
          body,
        }
      },
    },
  },
})

await shell.call(plugin)({
  mainComponentLoc: ['src', 'webapp', 'MainComponent.jsx'],
  deps: { me: expose },
})
