import { PkgIdentifier } from '@moodlenet/core'
import { ComponentType, PropsWithChildren } from 'react'
import { LocateApi } from '../web-lib/pri-http/xhr-adapter/callPkgApis.mjs'

export type WebPkgDepList = PkgIdentifier<any>[]
export type ReactAppMainComponent<UsesPkgs extends WebPkgDepList> = ComponentType<
  PropsWithChildren<ReactAppMainComponentProps<UsesPkgs>>
>
export type ReactAppMainComponentProps<UsesPkgs extends WebPkgDepList> = {
  pkgs: {
    [Index in keyof UsesPkgs]: UsePkgHandle<UsesPkgs[Index]>
  }
  pkgId: PkgIdentifier<any>
}
export type UsePkgHandle<UsesPkg extends PkgIdentifier<any>> = {
  call: LocateApi<UsesPkg>
}
