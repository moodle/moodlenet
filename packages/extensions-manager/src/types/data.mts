import { InstallPkgReq, PackageInfo, PkgIdentifier } from '@moodlenet/core'

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
      pkgId: PkgIdentifier
      installed: true
    }
  | {
      installPkgReq: InstallPkgReq
      installed: false
    }
)
export type DeployedPkgInfo = Pick<PackageInfo, 'packageJson' | 'readme'> & {
  pkgId: PkgIdentifier
}
