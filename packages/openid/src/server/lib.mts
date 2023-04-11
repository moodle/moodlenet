import { registeredPkgScopeDefs } from './oidc/registries.mjs'
import { shell } from './shell.mjs'
import { ScopeDefs } from './types/servicesTypes.mjs'

export async function registerScopes(scopeDefs: ScopeDefs) {
  const { pkgId } = shell.assertCallInitiator()
  registeredPkgScopeDefs[pkgId.name] = scopeDefs
}
