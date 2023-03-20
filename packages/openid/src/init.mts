export * from './lib.mjs'
export * from './types/asyncCtxTypes.mjs'

await import('./kvStore.mjs')
await import('./oidc/interactions-endpoints.mjs')
await import('./oidc/provider-endpoints.mjs')
await import('./expose.mjs')

// export const env = getEnv(shell.config)
// function getEnv(_: any): Env {
//   return {
//     __: _,
//   }
// }
// export type Env = { __?: unknown }
