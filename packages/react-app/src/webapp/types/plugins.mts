import { PkgIdentifier } from '@moodlenet/core'
import { ComponentType, PropsWithChildren } from 'react'
import { WebPkgDeps } from '../../common/types.mjs'
import { LocateApi } from '../web-lib/pri-http/xhr-adapter/callPkgApis.mjs'

export type ReactAppMainComponent = ComponentType<PropsWithChildren>

export type UsePkgHandle<TargetPkgId extends PkgIdentifier> = {
  pkgId: TargetPkgId
  call: LocateApi<TargetPkgId>
}
export type PkgContextT<
  PkgId extends PkgIdentifier,
  UsesPkgDeps extends WebPkgDeps | Record<string, never> = Record<string, never>,
> = {
  me: UsePkgHandle<PkgId>
  use: {
    [key in keyof UsesPkgDeps]: UsePkgHandle<UsesPkgDeps[key]>
  }
}
