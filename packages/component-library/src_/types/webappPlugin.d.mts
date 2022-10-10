import type { PackageInfo, PkgConnection } from '@moodlenet/core'
export declare type WebappPluginDef = {
  mainComponentLoc: string[]
  usesPkgs: PkgConnection<any>[]
}
export declare type WebappAddPackageAlias = {
  loc: string
  name: string
}
export declare type WebappPluginItem = WebappPluginDef & {
  guestPkgInfo: PackageInfo
}
//# sourceMappingURL=webappPlugin.d.mts.map
