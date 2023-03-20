import { PkgContextT } from '@moodlenet/react-app/web-lib'
import type { expose as me } from '../../server/expose.mjs'

export type OpenidWebAppDeps = {
  me: typeof me
}
export type OpenIdPkgContext = PkgContextT<OpenidWebAppDeps>
export type OpenIdContext = { pkg: OpenIdPkgContext }

export type RpcInteractionDetails = {
  promptType: string
  reasons: string[]
  clientId: string
  scopes: string[]
}
