import { PkgConnection, PkgIdentifier } from '@moodlenet/core'
import { ComponentType, PropsWithChildren } from 'react'
import { LocateApi } from '../webapp/main-lib/pri-http/xhr-adapter/callPkgApis.mjs'

export type WebappPluginDef = {
  mainComponentLoc: string
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

export type WebappPluginItem = WebappPluginDef & { guestPkgId: PkgIdentifier }

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

export type ReactAppMainComponent<UsesPkgs extends PkgConnection<any>[]> = ComponentType<
  PropsWithChildren<ReactAppMainComponentProps<UsesPkgs>>
>
export type ReactAppMainComponentProps<UsesPkgs extends PkgConnection<any>[]> = {
  pkgs: {
    [Index in keyof UsesPkgs]: UsePkgHandle<UsesPkgs[Index]>
  }
}
export type UsePkgHandle<UsesPkg extends PkgConnection<any>> = {
  // apis: UsesPkgs[Index] extends PkgConnection<infer _PkgApis> ? _PkgApis : never
  call: LocateApi<UsesPkg>
}

// export type PkgIds<Def extends ExtDef = ExtDef> = {
//   id: ExtId<Def>
//   name: ExtName<Def>
//   version: ExtVersion<Def>
// }

// export type WebAppShell<ForExt extends Ext<any, any>, Requires extends WebappRequires<any>> = ForExt extends Ext<
//   infer Def,
//   infer _Reqs
// >
//   ? {
//       deps: WebPkgDeps<Requires>
//       pkg: PkgIds<Def>
//       http: PriHttpFor<Def>
//       pkgHttp: typeof priHttpFor
//       createRegistry: CreateRegistry
//     }
//   : never

// export type MainModuleObj<Lib> = {
//   MainComponent?: PluginMainComponent
// } & (Lib extends undefined | void
//   ? {
//       pkgLibFor?: PkgLibFor<Lib>
//     }
//   : {
//       pkgLibFor: PkgLibFor<Lib>
//     })

// export type PkgLibFor<Lib> = <Def extends ExtDef>(_: { pkg: PkgIds<Def> }) => Lib

// export type ReactAppPluginMainModule = WebappPluginMainModule<ReactAppExt, ReactAppLib, any>
// export type ReactAppLib = {
//   route: RegGuest<RouteRegItem>
//   header: {
//     avatarMenuItem: RegGuest<HeaderAvatarMenuItemRegItem>
//     rightComponent: RegGuest<HeaderRightComponentRegItem>
//   }
//   settings: {
//     section: RegGuest<SettingsSectionItem>
//   }

//   auth: {
//     login: RegGuest<LoginItem>
//     signup: RegGuest<SignupItem>
//   }
// } & MainLib
