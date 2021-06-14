import { DelAssetAdapter } from '../../../../ports/static-assets/asset'
import { forceRmAsset, getDir } from './lib'

export const delAssetAdapter = ({ rootDir }: { rootDir: string }): DelAssetAdapter => {
  return {
    delAsset: async ({ assetId }) => {
      const assetDir = getDir(rootDir, 'assets')
      await forceRmAsset({ assetDir, assetId })
    },
  }
}
