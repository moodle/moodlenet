import type { PkgContextT } from '@moodlenet/react-app/webapp'
import type { OpenIdExposeType } from '../common/expose-def.mjs'

export type OpenidWebAppDeps = {
  me: OpenIdExposeType
}
export type OpenIdPkgContext = PkgContextT<OpenidWebAppDeps>
export type OpenIdContext = { pkg: OpenIdPkgContext }
