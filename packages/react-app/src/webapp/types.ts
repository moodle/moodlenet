import type { ExtDef, ExtId } from '@moodlenet/core'
import type { FC, PropsWithChildren } from 'react'

export type AppRoute = {
  label: string
  path: string
  Component: FC<any>
}
export interface ReactAppContainer {}

export interface RactAppExtInstance<T> {
  instance: T
  Comp?: FC<PropsWithChildren<{}>>
}

export type ReactAppExtMain<T> = (_: { reactAppContainer: ReactAppContainer }) => RactAppExtInstance<T>
export type ReactAppExt<Def extends ExtDef = ExtDef, T = any> = {
  extId: ExtId<Def>
  main: ReactAppExtMain<T>
}

export type ModRoute = { extId: ExtId; Component: React.ComponentType; path: string }
