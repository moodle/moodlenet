import { PackageJson } from 'type-fest'
import { PkgExport } from '../types'
import { NpmInstallReq, SymlinkInstallReq } from './installers'
export * from './installers/types'

export type InstallPkgReq = NpmInstallReq | SymlinkInstallReq

export type SafePackageJson = PackageJson & { name: string; version: string; moodlenet: MoodlenetPkgManifest }

export type MoodlenetPkgManifest = {
  displayName: string
  creator?: string
}

//info.json
export type PkgInstallationInfo = {
  installPkgReq: InstallPkgReq
}

export type InstalledPackageInfo = PackageInfo & {
  pkgExport: PkgExport
  installationInfo: PkgInstallationInfo
}

export type PackageInfo = {
  packageJson: SafePackageJson
  installationFolder: string
  mainModPath: string | undefined
  readme: string
  //rootDir: string
  //rootDirPosix: string
}
