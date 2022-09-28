import type { PackageInfo, PkgConnection } from '@moodlenet/core'

export type WebappPluginDef = {
  mainComponentLoc: string[]
  usesPkgs: PkgConnection<any>[]

  // addPackageAlias?: ExtAddPackageAlias
}

export type WebappAddPackageAlias = {
  loc: string
  name: string
}

// export type WebPkgDeps<Requires extends WebappRequires<any>> = {
//   [index in keyof Requires]: Requires[index] extends WebappPluginMainModule<infer _Ext, infer Lib, any> ? Lib : never
// }

export type WebappPluginItem = WebappPluginDef & { guestPkgInfo: PackageInfo }
