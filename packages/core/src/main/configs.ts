import { mkdirSync, readFileSync, unwatchFile, watchFile, writeFileSync } from 'fs'
import { resolve } from 'path'
import { LocalDeploymentConfig, MainFolders, SysConfig } from '../types/sys'
import * as consts from './default-consts'

export type ChangedConfigArg =
  | { type: 'sys'; curr: SysConfig; prev?: SysConfig }
  | { type: 'local'; curr: LocalDeploymentConfig; prev?: LocalDeploymentConfig }
export type ConfigWatcher = (changed: ChangedConfigArg) => unknown

type Cfg = {
  folders: MainFolders
}

export function getConfigs({ folders }: Cfg) {
  const sysConfigFilePath = resolve(folders.system, `${consts.sysConfigFileName}`)
  const localDeplConfigFilePath = resolve(folders.deployment, `${consts.localDeplConfigFileName}`)
  console.log({ sysConfigFilePath, localDeplConfigFilePath })
  return {
    folders,
    sysConfigFilePath,
    localDeplConfigFilePath,
    getSysConfig,
    getLocalDeplConfig,
    writeSysConfig,
    writeLocalDeplConfig,
    createSysPkgStorageFolder,
    setupWatcher,
  }

  function getSysConfig(): SysConfig {
    return JSON.parse(readFileSync(sysConfigFilePath, 'utf-8'))
  }

  function getLocalDeplConfig(): LocalDeploymentConfig {
    return JSON.parse(readFileSync(localDeplConfigFilePath, 'utf-8'))
  }

  function writeSysConfig(sysConfig: SysConfig) {
    writeFileSync(sysConfigFilePath, JSON.stringify(sysConfig, null, 2))
  }

  function writeLocalDeplConfig(localDeploymentConfig: LocalDeploymentConfig) {
    writeFileSync(localDeplConfigFilePath, JSON.stringify(localDeploymentConfig, null, 2))
  }

  function createSysPkgStorageFolder() {
    mkdirSync(resolve(folders.system, consts.sysPkgStorageFolder))
  }

  function setupWatcher(watcher: ConfigWatcher) {
    const unwatchers: Function[] = []
    if (watcher) {
      setImmediate(() => {
        let lastSysCfg = getSysConfig()
        watcher({ type: 'sys', curr: lastSysCfg })
        const sysWatcher = async () => {
          const curr = getSysConfig()
          await watcher({ type: 'sys', curr, prev: lastSysCfg })
          lastSysCfg = curr
        }
        watchFile(sysConfigFilePath, {}, sysWatcher)
        unwatchers.push(() => unwatchFile(sysConfigFilePath, sysWatcher))

        let lastLocalCfg = getLocalDeplConfig()
        watcher({ type: 'local', curr: lastLocalCfg })
        const localWatcher = async () => {
          const curr = getLocalDeplConfig()
          await watcher({ type: 'local', curr, prev: lastLocalCfg })
          lastLocalCfg = curr
        }
        watchFile(localDeplConfigFilePath, {}, localWatcher)
        unwatchers.push(() => unwatchFile(localDeplConfigFilePath, sysWatcher))
      })
    }
    return release
    function release() {
      unwatchers.forEach(unwatcher => unwatcher())
    }
  }
}
