import { PkgIdentifier } from '@moodlenet/core'
import { ComponentType, PropsWithChildren } from 'react'
import { LocateApi } from '../../webapp/web-lib/pri-http/xhr-adapter/callPkgApis.mjs'

// export type WebAppShellOf<PlgMod> = PlgMod extends WebappPluginMainModule<
//   infer _OfExt,
//   // any,
//   infer _Lib,
//   infer _Requires
// >
//   ? Parameters<PlgMod['connect']>[0]
//   : never
// // ? // ? OfExt extends Ext<infer _Def, infer _Reqs>
// //   WebAppShell<OfExt, Requires>
// // : never
// //  : never
// export type WebappRequires<Deps extends Dependencies> = {
//   [index in keyof Deps]:
//     | never
//     | WebappPluginMainModule<Ext<ExtDef<Deps[index]['name'], Deps[index]['version'], any, any>, any>, any, any>
// }
// export type WebappPluginMainModule<UsesPkgs extends WebappPluginMainModUsePkg[]> = {
//   connect(_: WebAppShell<ForExt, Requires>): MainModuleObj<Lib>
// }

export type WebPkgDepList = PkgIdentifier<any>[]
export type ReactAppMainComponent<UsesPkgs extends WebPkgDepList> = ComponentType<
  PropsWithChildren<ReactAppMainComponentProps<UsesPkgs>>
>
export type ReactAppMainComponentProps<UsesPkgs extends WebPkgDepList> = {
  pkgs: {
    [Index in keyof UsesPkgs]: UsePkgHandle<UsesPkgs[Index]>
  }
  pkgId: PkgIdentifier<any>
}
export type UsePkgHandle<UsesPkg extends PkgIdentifier<any>> = {
  call: LocateApi<UsesPkg>
}
