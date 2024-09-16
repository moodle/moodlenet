import type { PkgExposeDef } from '@moodlenet/core'
import type { DeployedPkgInfo } from './data.mjs'

export type ExtMngrExposeType = PkgExposeDef<{
  rpc: {
    // searchPackages(body: { searchText: string }): Promise<SearchPackagesResponse>
    listDeployed(): Promise<{ pkgInfos: DeployedPkgInfo[] }>
    // uninstall(body: PkgIdentifier[]): Promise<void>
    // install(body: InstallPkgReq[]): Promise<void>
    // getDefaultRegistry(): Promise<string>
  }
}>
