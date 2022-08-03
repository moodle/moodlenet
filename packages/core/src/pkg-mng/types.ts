import { PackageJson } from 'type-fest'
import { NpmInstallReq, SymlinkInstallReq } from './installers'
export * from './installers/types'

export type InstallPkgReq = NpmInstallReq | SymlinkInstallReq

export type MoodlenetPkgManifest = {}
export type SafePackageJson = PackageJson & { name: string; version: string; moodlenet: MoodlenetPkgManifest }

export type PkgInstallationId = string

//info.json
export type PkgInstallationInfo = {
  date: string
  installPkgReq: InstallPkgReq
  //  owner: ExtName ? PkgInstallationId ?
}

export type PackageInfo = PkgInstallationInfo & {
  id: PkgInstallationId
  packageJson: SafePackageJson
  readme: string | undefined
}
