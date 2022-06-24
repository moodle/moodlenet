import type { ExtId, ExtName, ExtVersion } from '@moodlenet/core'
import { ReactElement } from 'react'

export type ExtRoute = ExtInfo & {
  rootPath?: string
  extRoutingElement: ReactElement
}

export type ExtRouteDef = {
  moduleLoc: string
  rootPath?: string
}
export type ExtPluginDef = {
  routes: ExtRouteDef
}

export type ExtPlugin = ExtPluginDef & ExtInfo

export type ExtInfo = {
  extId: ExtId
  extName: ExtName
  extVersion: ExtVersion
}

export type ExtPluginsMap = Record<ExtId, ExtPlugin>
