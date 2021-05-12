import { GetAssetAdapter } from '../../../../ports/static-assets/asset'
import { getAssetStreamAndDesc, getDir } from './lib'

export const getAssetAdapter = ({ rootDir }: { rootDir: string }): GetAssetAdapter => {
  return {
    getAsset: async ({ assetId }) => getAssetStreamAndDesc({ assetDir: getDir(rootDir, 'assets'), assetId }),
  }
}
