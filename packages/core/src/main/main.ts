import { readFileSync, writeFileSync } from 'fs'
import { createPkgMng } from '../pkg-mng'
import { LocalDeploymentConfig, MainFolders, SysConfig } from '../types/sys'
import prepareFileSystem from './prepareFileSystem'

type Cfg = {
  mainFolders: MainFolders
}

export function getMain({ mainFolders }: Cfg) {
  const { sysPaths } = prepareFileSystem({ mainFolders })
  const pkgMng = createPkgMng({ pkgsFolder: sysPaths.localPkgsFolder, symlinkFolder: sysPaths.pkgStorageFolder })

  return {
    pkgMng,
    sysPaths,
    getSysConfig,
    getLocalDeplConfig,
    writeSysConfig,
    writeLocalDeplConfig,
  }

  function getSysConfig(): SysConfig {
    return JSON.parse(readFileSync(sysPaths.sysConfigFile, 'utf-8'))
  }

  function getLocalDeplConfig(): LocalDeploymentConfig {
    return JSON.parse(readFileSync(sysPaths.localConfigFile, 'utf-8'))
  }

  function writeSysConfig(sysConfig: SysConfig) {
    writeFileSync(sysPaths.sysConfigFile, JSON.stringify(sysConfig, null, 2))
  }

  function writeLocalDeplConfig(localDeploymentConfig: LocalDeploymentConfig) {
    writeFileSync(sysPaths.localConfigFile, JSON.stringify(localDeploymentConfig, null, 2))
  }
}
