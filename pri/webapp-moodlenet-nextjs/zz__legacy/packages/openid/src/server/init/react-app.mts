import { plugin } from '@moodlenet/react-app/server'
import type { OpenidWebAppDeps } from '../../common/types.mjs'
import { expose as myExpose } from '../expose.mjs'
import { shell } from '../shell.mjs'

export * from '../types/asyncCtxTypes.mjs'

await import('../oidc/interactions-endpoints.mjs')
await import('../oidc/provider-endpoints.mjs')
await import('../oidc/http-middleware.mjs')
await import('../expose.mjs')

await shell.call(plugin)<OpenidWebAppDeps>({
  initModuleLoc: ['dist', 'webapp', 'exports', 'init.mjs'],
  deps: { me: myExpose },
})
