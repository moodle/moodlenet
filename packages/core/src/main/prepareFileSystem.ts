import { mkdirSync } from 'fs'
import { resolve } from 'path'
import { MainFolders, SystemPaths } from '../types/sys'

export default function prepareFileSystem({ mainFolders }: { mainFolders: MainFolders }): {
  sysPaths: SystemPaths
} {
  const deploymentFolder = mainFolders.deploymentFolder
  const sysFolder = mainFolders.systemFolder

  const sysConfigFile = resolve(sysFolder, SYS_CONFIG_FILE_NAME)
  const localPkgsFolder = resolve(deploymentFolder, INSTALLED_PKGS_FOLDER_NAME)

  mkdirSync(localPkgsFolder, { recursive: true })
  mkdirSync(sysFolder, { recursive: true })
  mainFolders.pkgStorageFolder && mkdirSync(mainFolders.pkgStorageFolder, { recursive: true })

  const sysPaths: SystemPaths = {
    deploymentFolder,
    systemFolder: sysFolder,
    sysConfigFile,
    localPkgsFolder,
    pkgStorageFolder: mainFolders.pkgStorageFolder,
  }
  return { sysPaths }
}
export const SYS_CONFIG_FILE_NAME = 'sys-config.json'
export const INSTALLED_PKGS_FOLDER_NAME = 'installed-pkgs'
