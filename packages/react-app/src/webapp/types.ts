import type { ExtDef, ExtId } from '@moodlenet/kernel'
import type { FC, PropsWithChildren } from 'react'
import { ExtInstancesCtx } from './ext-instances'
import type { RouterCtx } from './routes'

export type AppRoute = {
  label: string
  path: string
  Component: FC<any>
}
export interface ReactAppContainer {
  RouterCtx: RouterCtx
  ExtInstancesCtx: ExtInstancesCtx
}

export interface RactAppExtInstance<T> {
  instance: T
  Comp?: FC<PropsWithChildren<{}>>
}

export type ReactAppExtMain<T> = (_: { reactAppContainer: ReactAppContainer }) => RactAppExtInstance<T>
export type ReactAppExt<Def extends ExtDef = ExtDef, T = any> = {
  extId: ExtId<Def>
  main: ReactAppExtMain<T>
}
