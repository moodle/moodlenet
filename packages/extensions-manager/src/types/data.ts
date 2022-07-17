import { InstallPkgReq } from '@moodlenet/core'

export type SearchPackagesResponse = { objects: SearchPackagesResObject[] }
export type SearchPackagesResObject = {
  name: string
  description: string
  keywords: string[]
  version?: string
  registry: string
  homepage?: string
} & (
  | {
      installationFolder: string
      installPkgReq: undefined
    }
  | {
      installationFolder: undefined
      installPkgReq: InstallPkgReq
    }
)
