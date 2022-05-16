import { SockOf } from '../../../../lib/plug'
import { getAssetAdapter } from '../../../../ports/static-assets/asset'
import { getAssetStreamAndDesc, getDir } from './lib'

export const getGetAssetAdapter =
  ({ rootDir }: { rootDir: string }): SockOf<typeof getAssetAdapter> =>
  async ({ assetId }) =>
    getAssetStreamAndDesc({ assetDir: getDir(rootDir, 'assets'), assetId })
