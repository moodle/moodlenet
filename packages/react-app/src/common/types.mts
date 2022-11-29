import type authConn from '@moodlenet/authentication-manager'
import { BaseStyleType } from '@moodlenet/component-library'
import type graphConn from '@moodlenet/content-graph'
import type coreConn from '@moodlenet/core'
import type organizationConn from '@moodlenet/organization'
import { CSSProperties } from 'react'
import type reactAppConn from '../server/main.mjs'
import type { PackageInfo, PkgIdentifier } from '@moodlenet/core'
import type { WebPkgDepList } from '../webapp/web-lib.mjs'

export type WebPkgDeps = [
  typeof reactAppConn,
  typeof organizationConn,
  typeof authConn,
  typeof graphConn,
  typeof coreConn,
]

export type WebappPluginDef<Deps extends WebPkgDepList = never> = {
  mainComponentLoc: string[]
  usesPkgs: Deps

  // addPackageAlias?: ExtAddPackageAlias
}

export type WebappAddPackageAlias = {
  loc: string
  name: string
}

// export type WebPkgDeps<Requires extends WebappRequires<any>> = {
//   [index in keyof Requires]: Requires[index] extends WebappPluginMainModule<infer _Ext, infer Lib, any> ? Lib : never
// }

export type WebappPluginItem<Deps extends WebPkgDepList = never> = WebappPluginDef<Deps> & {
  guestPkgInfo: PackageInfo
  guestPkgId: PkgIdentifier
}

export type CustomStyleType = BaseStyleType & CSSProperties
export type AppearanceData = {
  logo: string
  smallLogo: string
  color: string
  //TODO: decide if having this as optional
  customStyle?: CustomStyleType
}
