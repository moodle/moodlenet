import type { Ext, ExtDef, ExtId, ExtName, ExtVersion, Shell } from '@moodlenet/core'

export type WebappPluginDef = {
  mainModuleLoc: string
  // addPackageAlias?: ExtAddPackageAlias
}

export type WebappAddPackageAlias = {
  loc: string
  name: string
}

export type WebPkgDeps<ForExt extends Ext, Requires extends WebappRequires<ForExt>> = {
  [index in keyof Requires]: Requires[index] extends WebappPluginMainModule<any, infer Lib> ? Lib : never
}

export type WebappPluginItem = WebappPluginDef & { guestShell: Shell<any> }

export type WebappRequires<ForExt extends Ext> = ForExt extends Ext<any, infer Deps>
  ? {
      [pkgName in Deps[number]['name']]?: WebappPluginMainModule<Ext<ExtDef<pkgName>, any>, any>
    }
  : never

export type WebappPluginMainModule<
  ForExt extends Ext<any, any>,
  Lib = undefined,
  Requires extends WebappRequires<ForExt> = never,
> = {
  connect(_: { deps: WebPkgDeps<ForExt, Requires>; _: ForExt['name'] }): MainModuleObj<Lib>
}

export type MainModuleObj<Lib> = {} & (Lib extends undefined
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
