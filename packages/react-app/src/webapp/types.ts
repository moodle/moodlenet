import { FC } from 'react'
import { RouterCtx } from './routes'

export type AppRoute = {
  label: string
  path: string
  Component: FC
}

export type ExtCmp = FC<{ RouterCtx: RouterCtx }>
