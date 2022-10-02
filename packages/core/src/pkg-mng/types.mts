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
  pkgId: PkgIdentifier // TODO: REMOVE this, the pkgId will be created and stored in registry, and returned on getConnection(import.meta)
  packageJson: SafePackageJson
  readme: string | undefined
  pkgRootDir: string
}

// TODO: move following types in pkg-shell/connect/lib.mts
export type PkgName = string
export type PkgVersion = string
export type PkgIdentifier = {
  name: PkgName
  version: PkgVersion
  //TODO: add pkgSym here
}
