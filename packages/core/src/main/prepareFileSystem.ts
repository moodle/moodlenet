import { mkdirSync } from 'fs'
import { resolve } from 'path'
import { MainFolders, SystemPaths } from '../types/sys'

export default function prepareFileSystem({ mainFolders }: { mainFolders: MainFolders }): {
  sysPaths: SystemPaths
} {
  const deploymentFolder = mainFolders.deploymentFolder
  const sysFolder = mainFolders.systemFolder

  const sysConfigFile = resolve(sysFolder, SYS_CONFIG_FILE_NAME)
  const localDeplConfigFile = resolve(deploymentFolder, LOCAL_CONFIG_FILE_NAME)
  const localPkgsFolder = resolve(deploymentFolder, PKGS_FOLDER_NAME)

  mkdirSync(localPkgsFolder, { recursive: true })
  mkdirSync(sysFolder, { recursive: true })

  const sysPaths: SystemPaths = {
    deploymentFolder: deploymentFolder,
    systemFolder: sysFolder,
    sysConfigFile,
    localConfigFile: localDeplConfigFile,
    localPkgsFolder,
  }
  console.log({ sysPaths })
  return { sysPaths }
}
export const SYS_CONFIG_FILE_NAME = 'sys-config.json'
export const PKGS_FOLDER_NAME = 'pkgs-storage'
export const LOCAL_CONFIG_FILE_NAME = 'local-config.json'
