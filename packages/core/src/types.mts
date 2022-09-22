export * from './pkg-mng/types.mjs'
export * from './pkg-shell/types.mjs'
import { InstallPkgReq, PkgIdentifier } from './pkg-mng/types.mjs'

export type MainFolders = { systemFolder: string; deploymentFolder: string; pkgStorageFolder?: string }
// SysConfig
export type SystemPaths = MainFolders & {
  sysConfigFile: string
  localPkgsFolder: string
}

export type SysInstalledPkg = {
  pkgId: PkgIdentifier
  date: string
  installPkgReq: InstallPkgReq
  env: { default?: ExtensionEnv } & Record<string, ExtensionEnv>
}
export type SysInstalledPkgs = SysInstalledPkg[]
export type SysConfig = {
  packages: SysInstalledPkgs
}

//  --  //

export type ExtensionEnv = unknown
export type EnvName = string
export type PkgName = string
export type PkgVersion = string
export type NpmRegistry = string
