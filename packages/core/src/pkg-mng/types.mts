import { PackageJson } from 'type-fest'
import { NpmInstallReq, SymlinkInstallReq } from './installers/types.mjs'
export * from './installers/types.mjs'

export type InstallPkgReq = NpmInstallReq | SymlinkInstallReq

export type MoodlenetPkgManifest = {}
export type SafePackageJson = PackageJson & { name: string; version: string; moodlenet: MoodlenetPkgManifest }

export type PackageInfo = {
  packageJson: SafePackageJson
  readme: string | undefined
  pkgRootDir: string
}
