import { plugin } from '@moodlenet/react-app/server'
import { OpenidWebAppDeps } from '../common/webapp/types.mjs'
import { expose as myExpose } from './expose.mjs'
import { shell } from './shell.mjs'

export * from './lib.mjs'
export * from './types/asyncCtxTypes.mjs'

await import('./oidc/interactions-endpoints.mjs')
await import('./oidc/provider-endpoints.mjs')
await import('./oidc/http-middleware.mjs')
await import('./expose.mjs')

await shell.call(plugin)<OpenidWebAppDeps>({
  mainComponentLoc: ['dist', 'webapp', 'MainComponent.js'],
  deps: {
    me: myExpose,
  },
})

// export const env = getEnv(shell.config)
// function getEnv(_: any): Env {
//   return {
//     __: _,
//   }
// }
// export type Env = { __?: unknown }
