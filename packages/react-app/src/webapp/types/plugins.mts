import type { PkgExposeDef, PkgIdentifier } from '@moodlenet/core'
import type { ComponentType, PropsWithChildren } from 'react'
import type { WebPkgDeps } from '../../common/types.mjs'
import type { PkgRpcHandle } from '../web-lib/pri-http/xhr-adapter/callPkgApis.mjs'

export type ReactAppMainComponent = ComponentType<PropsWithChildren>

export type UsePkgHandle<TargetPkgExposeDef extends PkgExposeDef> = {
  pkgId: PkgIdentifier
  rpc: PkgRpcHandle<TargetPkgExposeDef>
}
export type PkgContextT<
  UsesPkgDeps extends WebPkgDeps /* | Record<string, never>  */ = Record<string, never>,
> = {
  myId: PkgIdentifier
  use: {
    [key in keyof UsesPkgDeps]: UsePkgHandle<UsesPkgDeps[key]>
  }
}
