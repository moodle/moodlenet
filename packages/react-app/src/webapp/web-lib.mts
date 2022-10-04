export * as registries from './registries.mjs'
// @index(['./web-lib/**/*.{mts,tsx}','./types/**/*.{mts,tsx}'], f => `export * from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * from './types/plugins.mjs'
export * from './web-lib/auth.js'
export * from './web-lib/pri-http/xhr-adapter/callPkgApis.mjs'
// eslint: ignore
// @endindex
