import { mkdirSync } from 'fs'
import { getCreateTempAssetAdapter } from './adapters/createTemp'
import { getDelAssetAdapter } from './adapters/delAsset'
import { getGetAssetAdapter } from './adapters/getAsset'
import { getDir } from './adapters/lib'
import { getPersistTempAssetsAdapter } from './adapters/persistTemp'
type Cfg = {
  rootDir: string
}

export const getFsAssetAdapters = async ({ rootDir }: Cfg) => {
  const tempDir = getDir(rootDir, 'temp')
  const assetDir = getDir(rootDir, 'assets')
  await mkdirSync(tempDir, { recursive: true })
  await mkdirSync(assetDir, { recursive: true })
  return {
    createTempAssetAdapter: getCreateTempAssetAdapter({ rootDir }),
    delAssetAdapter: getDelAssetAdapter({ rootDir }),
    getAssetAdapter: getGetAssetAdapter({ rootDir }),
    persistTempAssetsAdapter: getPersistTempAssetsAdapter({ rootDir }),
  }
}
