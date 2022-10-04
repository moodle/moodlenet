import { InstallPkgReq } from '@moodlenet/core'

export type SearchPackagesResponse = { objects: SearchPackagesResObject[] }
export type SearchPackagesResObject = {
  pkgName: string
  description: string
  keywords: string[]
  version?: string
  registry: string
  homepage?: string
} & (
  | {
      pkgInstallationId: string
      installed: true
    }
  | {
      installPkgReq: InstallPkgReq
      installed: false
    }
)
