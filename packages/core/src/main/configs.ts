import { mkdirSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { LocalDeploymentConfig, MainFolders, SysConfig } from '../types/sys'
import { localDeplConfigFileModName, sysConfigFileModName, sysPkgStorageFolder } from './default-consts'

type Cfg = { folders: MainFolders }

export function getConfigs({ folders }: Cfg) {
  return {
    folders,
    getSysConfigModId,
    getLocalDeplConfigModId,
    getSysConfig,
    getLocalDeplConfig,
    writeSysConfig,
    writeLocalDeplConfig,
    createSysPkgStorageFolder,
  }

  function getSysConfigModId() {
    return resolve(folders.system, `${sysConfigFileModName}`)
  }

  function getLocalDeplConfigModId() {
    return resolve(folders.deployment, `${localDeplConfigFileModName}`)
  }

  function getSysConfig(): SysConfig {
    return require(getSysConfigModId()).default
  }

  function getLocalDeplConfig(): LocalDeploymentConfig {
    return require(getLocalDeplConfigModId()).default
  }

  function writeSysConfig(sysConfig: SysConfig) {
    const content = `module.exports.default = ${JSON.stringify(sysConfig, null, 2)}`
    writeFileSync(`${getSysConfigModId()}.js`, content)
  }

  function writeLocalDeplConfig(localDeploymentConfig: LocalDeploymentConfig) {
    const content = `module.exports.default = ${JSON.stringify(localDeploymentConfig, null, 2)}`
    writeFileSync(`${getLocalDeplConfigModId()}.js`, content)
  }

  function createSysPkgStorageFolder() {
    mkdirSync(resolve(folders.system, sysPkgStorageFolder))
  }
}
