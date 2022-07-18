import type { ExtDef, ExtId, ExtName, ExtVersion } from '@moodlenet/core'
import { ComponentType, PropsWithChildren, ReactElement } from 'react'

export type ExtRoute = ExtInfo & {
  rootPath?: string
  extRoutingElement: ReactElement
}
export type ExtRouteDef = {
  moduleLoc: string
  rootPath?: string
}

export type ExtPluginDef = {
  routes?: ExtRouteDef
  expose?: ExtExposeDef
  ctxProvider?: ExtContextProviderDef
  addPackageAlias?: ExtAddPackageAlias
}

export type ExtAddPackageAlias = {
  loc: string
  name: string
}

export type ExtExposeDef = {
  moduleLoc: string
}

export type ExtExpose = { lib: any } & ExtInfo

export type ExtPlugin = ExtPluginDef & ExtInfo

export type ExtInfo = {
  extId: ExtId
  extName: ExtName
  extVersion: ExtVersion
}

export type ExtPluginsMap = Record<ExtId, ExtPlugin>

export type ExtModule<Def extends ExtDef, T> = [ExtName<Def>, T]

export type ExtContextProviderDef = {
  moduleLoc: string
}
export type ExtContextProviderComp = ComponentType<PropsWithChildren<{}>>

export type ExtContextProvider = ExtInfo & { Provider: ExtContextProviderComp }
