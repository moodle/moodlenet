import { PkgExposeDef, PkgIdentifier } from '@moodlenet/core'
import { ComponentType, PropsWithChildren } from 'react'
import { WebPkgDeps } from '../../common/types.mjs'
import { PkgRpcHandle } from '../web-lib/pri-http/xhr-adapter/callPkgApis.mjs'

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
