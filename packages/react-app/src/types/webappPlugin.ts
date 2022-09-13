import type { Dependencies, Ext, ExtDef, ExtId, ExtName, ExtVersion, Shell } from '@moodlenet/core'
import { ComponentType, PropsWithChildren } from 'react'
import { ReactAppExt } from '..'
import { RouteRegItem } from '../webapp/app-routes'
import { MainLib } from '../webapp/main-lib'
import { priHttpFor, PriHttpFor } from '../webapp/main-lib/pri-http'
import { RegGuest } from '../webapp/main-lib/registry'
import { HeaderAvatarMenuItemRegItem, HeaderRightComponentRegItem } from '../webapp/ui/components/organisms/Header'
import { SettingsSectionItem } from '../webapp/ui/components/pages/Settings/SettingsContext'

export type WebappPluginDef = {
  mainModuleLoc: string
  // addPackageAlias?: ExtAddPackageAlias
}

export type WebappAddPackageAlias = {
  loc: string
  name: string
}

export type WebPkgDeps<Requires extends WebappRequires<any>> = {
  [index in keyof Requires]: Requires[index] extends WebappPluginMainModule<infer _Ext, infer Lib, any> ? Lib : never
}

export type WebappPluginItem = WebappPluginDef & { guestShell: Shell<any> }

export type WebAppShellOf<PlgMod> = PlgMod extends WebappPluginMainModule<
  infer _OfExt,
  // any,
  infer _Lib,
  infer _Requires
>
  ? Parameters<PlgMod['connect']>[0]
  : never
// ? // ? OfExt extends Ext<infer _Def, infer _Reqs>
//   WebAppShell<OfExt, Requires>
// : never
//  : never

export type WebappRequires<Deps extends Dependencies> = {
  [index in keyof Deps]:
    | never
    | WebappPluginMainModule<Ext<ExtDef<Deps[index]['name'], Deps[index]['version'], any, any>, any>, any, any>
}

export type WebappPluginMainModule<
  ForExt extends Ext<any, any>,
  Lib,
  Requires extends ForExt extends Ext<infer _Def, infer Deps>
    ? WebappRequires<Deps>
    : WebappRequires<Dependencies> = never,
> = {
  connect(_: WebAppShell<ForExt, Requires>): MainModuleObj<Lib>
}

export type PkgIds<Def extends ExtDef = ExtDef> = {
  id: ExtId<Def>
  name: ExtName<Def>
  version: ExtVersion<Def>
}

export type WebAppShell<ForExt extends Ext<any, any>, Requires extends WebappRequires<any>> = ForExt extends Ext<
  infer Def,
  infer _Reqs
>
  ? {
      deps: WebPkgDeps<Requires>
      pkg: PkgIds<Def>
      http: PriHttpFor<Def>
      pkgHttp: typeof priHttpFor
    }
  : never

export type MainModuleObj<Lib> = {
  MainComponent?: PluginMainComponent
} & (Lib extends undefined
  ? {
      pkgLibFor?: PkgLibFor<Lib>
    }
  : {
      pkgLibFor: PkgLibFor<Lib>
    })

export type PkgLibFor<Lib> = <Def extends ExtDef>(_: { pkg: PkgIds<Def> }) => Lib

export type PluginMainComponent = ComponentType<PropsWithChildren<PluginMainComponentProps>>
export type PluginMainComponentProps = {}

export type ReactAppPluginMainModule = WebappPluginMainModule<ReactAppExt, ReactAppLib, any>
export type ReactAppLib = {
  route: RegGuest<RouteRegItem>
  header: {
    avatarMenuItem: RegGuest<HeaderAvatarMenuItemRegItem>
    rightComponent: RegGuest<HeaderRightComponentRegItem>
  }
  settings: {
    section: RegGuest<SettingsSectionItem>
  }
} & MainLib
