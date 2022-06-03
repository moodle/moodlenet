import type { ExtName, Version } from '@moodlenet/kernel'
import type { FC, PropsWithChildren } from 'react'
import type { HttpAdapterCtx } from './http-adapter'
import type { RouterCtx } from './routes'

export type AppRoute = {
  label: string
  path: string
  Component: FC<any>
}
export interface RactAppContainer {
  RouterCtx: RouterCtx
  HttpAdapterCtx: HttpAdapterCtx
}

export interface RactAppExtInstance<T> {
  handle: T
  Comp?: FC<PropsWithChildren<{}>>
}

export type ReactAppExtMain<T> = (ractAppContainer: RactAppContainer) => RactAppExtInstance<T>
export type ReactAppExt<T> = {
  main: ReactAppExtMain<T>
  version: Version
  extName: ExtName
}
