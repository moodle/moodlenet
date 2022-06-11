import {
  DefaultNpmRegistry,
  LocalDeplConfigFileModName,
  NpmRegistry,
  SysConfigFileModName,
  SysPkgStorageFolder,
} from '../types/sys'

export const sysConfigFileModName: SysConfigFileModName = 'sys-config'
export const sysPkgStorageFolder: SysPkgStorageFolder = 'pkgs-storage'
export const localDeplConfigFileModName: LocalDeplConfigFileModName = 'local-deployment-config'
export const defaultNpmRegistry: DefaultNpmRegistry = 'https://registry.npmjs.org/'
export const getRegistry = (_reg?: string | undefined): NpmRegistry => _reg ?? defaultNpmRegistry
