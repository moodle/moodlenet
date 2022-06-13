import {
  DefaultNpmRegistry,
  LocalDeplConfigFileName,
  NpmRegistry,
  SysConfigFileName,
  SysPkgStorageFolder,
} from '../types/sys'

export const sysConfigFileName: SysConfigFileName = 'sys-config.json'
export const sysPkgStorageFolder: SysPkgStorageFolder = 'pkgs-storage'
export const localDeplConfigFileName: LocalDeplConfigFileName = 'local-deployment-config.json'
export const defaultNpmRegistry: DefaultNpmRegistry = 'https://registry.npmjs.org/'
export const getRegistry = (_reg?: string | undefined): NpmRegistry => _reg ?? defaultNpmRegistry
