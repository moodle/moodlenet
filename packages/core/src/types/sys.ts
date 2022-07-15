import { InstallPkgReq } from '../pkg-mng/types'
import { ExtId, ExtName } from './ext'

export type MainFolders = { systemFolder: string; deploymentFolder: string; pkgStorageFolder?: string }
// SysConfig
export type SystemPaths = MainFolders & {
  sysConfigFile: string
  localConfigFile: string
  localPkgsFolder: string
}
export type SysConfig = {
  installedPackages: { installationFolder: string; installPkgReq: InstallPkgReq }[]
  enabledExtensions: { installationFolder: string; extId: ExtId }[]
  core: { installationFolder: string }
}

export type ExtensionGlobalConfig = {
  config?: any
}

export type LocalDeploymentConfig = {
  extensions: Record<ExtName, ExtensionLocalConfig>
}

export type ExtensionLocalConfig = {
  config?: any
  deployWith?: DeployWithModule
}

//  --  //

export type DeployWithModule = string
export type PkgName = string
export type PkgVersion = string
export type NpmRegistry = string
