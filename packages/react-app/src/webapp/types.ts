import type { ExtDef, ExtId, ExtName, ExtVersion } from '@moodlenet/core'
import type { FC, PropsWithChildren, ReactElement } from 'react'

export interface ReactAppContainer {}

export interface RactAppExtInstance<T> {
  instance: T
  Comp?: FC<PropsWithChildren<{}>>
}

export type ReactAppExtMain<T> = (_: { reactAppContainer: ReactAppContainer }) => RactAppExtInstance<T>
export type ReactAppExt<Def extends ExtDef = ExtDef, T = any> = {
  extId: ExtId<Def>
  extName: ExtName<Def>
  extVersion: ExtVersion<Def>
  main: ReactAppExtMain<T>
}

export type ModRoute = {
  rootPath?: string
  extId: ExtId
  extName: ExtName
  extVersion: ExtVersion
  extRoutingElement: ReactElement
}
