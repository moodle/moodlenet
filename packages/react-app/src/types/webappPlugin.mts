import type { PackageInfo } from '@moodlenet/core'
import { WebPkgDepList } from '../webapp/web-lib.mjs'

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
}
