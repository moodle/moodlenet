import { PackageJson } from 'type-fest'
import { NpmInstallReq, SymlinkInstallReq } from './installers/types.mjs'
export * from './installers/types.mjs'

export type InstallPkgReq = NpmInstallReq | SymlinkInstallReq

export type MoodlenetPkgManifest = {}
export type SafePackageJson = PackageJson & { name: string; version: string; moodlenet: MoodlenetPkgManifest }

/* //info.json
export type PkgInstallationInfo = {
  date: string
  installPkgReq: InstallPkgReq
  //  owner: ExtName ? PkgInstallationId ?
} */

export type PackageInfo = {
  pkgId: PkgIdentifier
  packageJson: SafePackageJson
  readme: string | undefined
  pkgRootDir: string
}

export type PkgName = string
export type PkgVersion = string
export type PkgIdentifier = {
  name: PkgName
  version: PkgVersion
}
