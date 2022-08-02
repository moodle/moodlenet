import { readFileSync, writeFileSync } from 'fs'
import { createPkgMng } from '../pkg-mng'
import { MainFolders, SysConfig } from '../types/sys'
import prepareFileSystem from './prepareFileSystem'

type Cfg = {
  mainFolders: MainFolders
}

export function getMain({ mainFolders }: Cfg) {
  const { sysPaths } = prepareFileSystem({ mainFolders })
  const pkgMng = createPkgMng({ pkgsFolder: sysPaths.localPkgsFolder })

  return {
    pkgMng,
    sysPaths,
    readSysConfig,
    writeSysConfig,
  }

  function readSysConfig(): SysConfig {
    return JSON.parse(readFileSync(sysPaths.sysConfigFile, 'utf-8'))
  }

  function writeSysConfig(sysConfig: SysConfig) {
    writeFileSync(sysPaths.sysConfigFile, JSON.stringify(sysConfig, null, 2))
  }
}
