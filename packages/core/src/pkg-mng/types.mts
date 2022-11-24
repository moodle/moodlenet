import { PackageJson } from 'type-fest'
import { PkgIdentifier } from '../types.mjs'

export type InstallerType = 'pack-folder' | 'npm' //| 'file' | 'git'
export type _InstallPkgReq<Type extends InstallerType, More> = More & { type: Type }
export type NpmInstallReq = _InstallPkgReq<'npm', { pkgId: PkgIdentifier }>
export type PackFolderInstallReq = _InstallPkgReq<'pack-folder', { fromFolder: string }>

export type InstallPkgReq = NpmInstallReq | PackFolderInstallReq

// export type MoodlenetPkgManifest = Record<string, never>
export type SafePackageJson = PackageJson & {
  name: string
  version: string
  // moodlenet: MoodlenetPkgManifest
  readme?: string
}

export type PackageInfo = {
  packageJson: SafePackageJson
  readme: string | undefined
  pkgRootDir: string
}

export type NpmRegistry = string
