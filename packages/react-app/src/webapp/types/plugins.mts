import { PkgConnection, PkgIdentifier } from '@moodlenet/core'
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

export type WebPkgDepList = PkgConnection<any>[] //TODO: will be PkgIdentifier[] as soon as refactored in core (PkgConnection no more)
export type ReactAppMainComponent<UsesPkgs extends WebPkgDepList> = ComponentType<
  PropsWithChildren<ReactAppMainComponentProps<UsesPkgs>>
>
export type ReactAppMainComponentProps<UsesPkgs extends WebPkgDepList> = {
  pkgs: {
    [Index in keyof UsesPkgs]: UsePkgHandle<UsesPkgs[Index]>
  }
  pkgId: WebPkgIdentifier
}
export type UsePkgHandle<UsesPkg extends PkgConnection<any>> = {
  //TODO: will be PkgIdentifier as soon as refactored in core (PkgConnection no more)
  // apis: UsesPkgs[Index] extends PkgConnectiononnection<infer _PkgApis> ? _PkgApis : never
  call: LocateApi<UsesPkg>
}

//TODO: back to simply PkgIdentifier as soon as refactored in core
export type WebPkgIdentifier = PkgIdentifier & { readonly pkgRef: unique symbol }
