import apis from './apis.mjs'
import { connectPkg } from './pkg-shell/shell.mjs'

const pkgConnection = await connectPkg(import.meta, {
  apis: apis,
})

export default pkgConnection
