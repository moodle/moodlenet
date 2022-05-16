import { SockOf } from '../../../../lib/plug'
import { delAssetAdapter } from '../../../../ports/static-assets/asset'
import { forceRmAsset, getDir } from './lib'

export const getDelAssetAdapter =
  ({ rootDir }: { rootDir: string }): SockOf<typeof delAssetAdapter> =>
  async ({ assetId }) => {
    const assetDir = getDir(rootDir, 'assets')
    await forceRmAsset({ assetDir, assetId })
  }
