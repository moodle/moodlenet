import type { Dependencies, Ext, ExtDef, ExtId, ExtName, ExtVersion, Shell } from '@moodlenet/core'
import { ComponentType, PropsWithChildren } from 'react'
import { ReactAppExt } from '..'
import { MainLib } from '../webapp/main-lib'
import { priHttpFor, PriHttpFor } from '../webapp/main-lib/pri-http'
import { Registrar } from '../webapp/main-lib/registry'

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
  connect(_: { deps: WebPkgDeps<Requires> } & WebAppShell<ForExt>): MainModuleObj<Lib>
}
export type WebAppShell<ForExt extends Ext<any, any>> = ForExt extends Ext<infer Def, infer _Reqs>
  ? {
      extId: ExtId<Def>
      extName: ExtName<Def>
      extVersion: ExtVersion<Def>
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

export type PkgLibFor<Lib> = <Def extends ExtDef>(_: {
  extId: ExtId<Def>
  extName: ExtName<Def>
  extVersion: ExtVersion<Def>
}) => Lib

export type PluginMainComponent = ComponentType<PropsWithChildren<PluginMainComponentProps>>
export type PluginMainComponentProps = {}

export type ReactAppPluginMainModule = WebappPluginMainModule<ReactAppExt, ReactAppLib, any>
export type ReactAppLib = {
  collectX: Registrar<{ a: number }>
} & MainLib
