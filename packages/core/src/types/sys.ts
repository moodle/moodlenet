import { ExtName, ExtVersion } from './ext'

export type MainFolders = { system: string; deployment: string }
// SysConfig

export type SysConfig = {
  installedPackages: SysPackages
  enabledExtensions: SysEnabledExtensions
  __FIRST_INSTALL?: true
}

export type SysEnabledExtensions = Record<ExtName, SysEnabledExtDecl>

export type SysEnabledExtDecl = {
  version: ExtVersion
  pkg: PkgName
  config?: any
}

export type SysPackages = Record<PkgName, SysPkgDecl>

export type SysPkgDeclNamed = SysPkgDecl & { name: PkgName }
export type SysPkgDecl =
  | {
      type: 'npm'
      version: PkgVersion
      registry: NpmRegistry
    }
  | {
      type: 'file'
      location: FilePkgLocation
    }

// LocalDeploymentsConfig

export type LocalDeploymentConfig = {
  extensions: Record<ExtName, ExtensionDeploymentConfig>
}

export type ExtensionDeploymentConfig = {
  config?: any
  deployWith?: DeployWithModule
}

//  --  //

export type DeployWithModule = string
export type PkgName = string
export type PkgVersion = string
export type NpmRegistry = string
export type FilePkgLocation = string

export type SysConfigFileName = 'sys-config.json'
export type LocalDeplConfigFileName = 'local-deployment-config.json'
export type SysPkgStorageFolder = 'pkgs-storage'
export type DefaultNpmRegistry = 'https://registry.npmjs.org/'
