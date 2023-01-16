import { BaseStyleType } from '@moodlenet/component-library'
import { CSSProperties } from 'react'
import type { PackageInfo, PkgExpose, PkgIdentifier } from '@moodlenet/core'

export type WebPkgDeps = {
  [k in string]: PkgExpose
}

export type WebappPluginDef<
  Deps extends WebPkgDeps | Record<string, never> = Record<string, never>,
> = {
  mainComponentLoc: string[]
  deps: Deps
}

// export type WebappAddPackageAlias = {
//   loc: string
//   name: string
// }

// export type WebPkgDeps<Requires extends WebappRequires<any>> = {
//   [index in keyof Requires]: Requires[index] extends WebappPluginMainModule<infer _Ext, infer Lib, any> ? Lib : never
// }

export type WebappPluginItem<Deps extends WebPkgDeps = WebPkgDeps> = WebappPluginDef<Deps> & {
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

export type User = {
  displayName: string
  email: string
  userTypes: string[]
  toggleUserType: (userType: string) => void
}
