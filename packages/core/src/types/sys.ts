import { InstallPkgReq, PkgInstallationId } from '../pkg-mng/types'

export type MainFolders = { systemFolder: string; deploymentFolder: string; pkgStorageFolder?: string }
// SysConfig
export type SystemPaths = MainFolders & {
  sysConfigFile: string
  localPkgsFolder: string
}

export type SysInstalledPkg = {
  date: string
  installPkgReq: InstallPkgReq
  env: { default?: ExtensionEnv } & Record<string, ExtensionEnv>
}
export type SysInstalledPkgs = {
  [id: PkgInstallationId]: SysInstalledPkg
}
export type SysConfig = {
  __FIRST_RUN__?: true
  packages: SysInstalledPkgs
}

//  --  //

export type ExtensionEnv = unknown
export type EnvName = string
export type PkgName = string
export type PkgVersion = string
export type NpmRegistry = string
