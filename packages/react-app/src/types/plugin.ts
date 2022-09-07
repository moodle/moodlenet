import type { Ext, ExtDef, ExtId, ExtName, ExtVersion, Shell } from '@moodlenet/core'

export type ExtPluginDef = {
  mainModuleLoc: string
  // addPackageAlias?: ExtAddPackageAlias
}

export type ExtAddPackageAlias = {
  loc: string
  name: string
}

export type ExtPluginModule<
  ForExt extends Ext,
  Lib,
  Deps extends ForExt extends Ext<any, infer Reqs>
    ? {
        [index in keyof Reqs]: ExtPluginModule<Ext<Reqs[index]>, any, any>
      }
    : never,
> = Deps extends never
  ? never
  : {
      deps: {
        [index in keyof Deps]: Deps[index] extends ExtPluginModule<any, infer Lib, any> ? Lib : never
      }
      getLibFor<Def extends ExtDef>(_: { extId: ExtId<Def>; extName: ExtName<Def>; version: ExtVersion<Def> }): Lib
    }

export type ExtPluginItem = ExtPluginDef & { guestShell: Shell<any> }
