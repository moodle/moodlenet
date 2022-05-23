import type { ExtId } from '@moodlenet/kernel'
import type { FC } from 'react'
import type { RouterCtx } from './routes'

export type AppRoute = {
  label: string
  path: string
  Component: FC
}

export type ExtCmp = FC<{ RouterCtx: RouterCtx }>

export type ReactAppExt = {
  MainComponent: ExtCmp
  extId: ExtId
}
