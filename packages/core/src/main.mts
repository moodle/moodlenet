export * from './pkg-mng/types.mjs'
export * from './pkg-registry/types.mjs'
export * from './types.mjs'
export { NPM_REGISTRY } from './pkg-mng/lib/npm.mjs'
export * from './pkg-shell/shell.mjs'
import apis from './apis.mjs'
import { connectPkg } from './pkg-shell/shell.mjs'

console.log('HA ! UPGRADED')

const pkgConnection = await connectPkg(import.meta, {
  apis: apis,
})

export default pkgConnection
