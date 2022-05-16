import { mkdirSync } from 'fs'
import { getCreateTempAssetAdapter } from './adapters/createTemp'
import { getDelAssetAdapter } from './adapters/delAsset'
import { getGetAssetAdapter } from './adapters/getAsset'
import { delOldTemps, getDir } from './adapters/lib'
import { getPersistTempAssetsAdapter } from './adapters/persistTemp'
type Cfg = {
  rootDir: string
  keepTempsForSecs: number
}

export const getFsAssetAdapters = async ({ rootDir, keepTempsForSecs }: Cfg) => {
  const tempDir = getDir(rootDir, 'temp')
  const assetDir = getDir(rootDir, 'assets')
  await mkdirSync(tempDir, { recursive: true })
  await mkdirSync(assetDir, { recursive: true })
  const _delOldTemps = () => delOldTemps({ tempDir, olderThanSecs: keepTempsForSecs })
  _delOldTemps()
  setInterval(_delOldTemps, keepTempsForSecs * 1010)
  return {
    createTempAssetAdapter: getCreateTempAssetAdapter({ rootDir }),
    delAssetAdapter: getDelAssetAdapter({ rootDir }),
    getAssetAdapter: getGetAssetAdapter({ rootDir }),
    persistTempAssetsAdapter: getPersistTempAssetsAdapter({ rootDir }),
  }
}
