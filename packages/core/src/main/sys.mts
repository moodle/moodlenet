import { readFileSync, writeFileSync } from 'fs'
import { createPkgMng } from '../pkg-mng.mjs'
import { MainFolders, SysConfig } from '../types.mjs'
import prepareFileSystem from './prepareFileSystem.mjs'

type Cfg = {
  mainFolders: MainFolders
}

export async function getSys({ mainFolders }: Cfg) {
  const { sysPaths } = await prepareFileSystem({ mainFolders })
  const pkgMng = await createPkgMng({ pkgsFolder: sysPaths.localPkgsFolder })

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
