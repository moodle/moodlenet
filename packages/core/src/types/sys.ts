import { PkgInstallationId } from '../pkg-mng/types'

export type MainFolders = { systemFolder: string; deploymentFolder: string; pkgStorageFolder?: string }
// SysConfig
export type SystemPaths = MainFolders & {
  sysConfigFile: string
  localPkgsFolder: string
}

export type SysInstalledPkg = {
  configs: Record<string, ExtensionLocalConfig>
}
export type SysInstalledPkgs = {
  [id: PkgInstallationId]: SysInstalledPkg
}
export type SysConfig = {
  packages: SysInstalledPkgs
}

export type ExtensionLocalConfig = {
  env?: any
  proxyDeploy?: true
}

//  --  //

export type PkgName = string
export type PkgVersion = string
export type NpmRegistry = string
