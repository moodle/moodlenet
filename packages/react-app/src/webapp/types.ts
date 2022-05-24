import type { ExtName, Version } from '@moodlenet/kernel'
import type { FC } from 'react'
import type { RouterCtx } from './routes'

export type AppRoute = {
  label: string
  path: string
  Component: FC
}
export interface RactAppContainer {
  RouterCtx: RouterCtx
}

export interface RactAppExtInstance<T> {
  handle: T
  Comp?: FC
}
export type ReactAppExtMain<T> = (ractAppContainer: RactAppContainer) => RactAppExtInstance<T>
export type ReactAppExt<T> = {
  main: ReactAppExtMain<T>
  version: Version
  extName: ExtName
}
