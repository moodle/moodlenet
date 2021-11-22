import { isJust } from '@moodlenet/common/dist/utils/array'
import { Tuple } from 'tuple-type'
import { SockOf } from '../../../../lib/plug'
import { persistTempAssetsAdapter } from '../../../../ports/static-assets/temp'
import { AssetFileDesc, PersistTmpFileReq } from '../../../../ports/static-assets/types'
import { forceRmAsset, getDir, persistTemp } from './lib'
export const getPersistTempAssetsAdapter =
  ({ rootDir }: { rootDir: string }): SockOf<typeof persistTempAssetsAdapter> =>
  async <N extends number>({ persistTmpFilesReqs }: { persistTmpFilesReqs: Tuple<PersistTmpFileReq, N> }) => {
    const assetDir = getDir(rootDir, 'assets')
    const resultsP = persistTmpFilesReqs.map(({ tempAssetId, uploadType }) =>
      persistTemp({ rootDir, tempAssetId, uploadType }),
    )
    const results = await Promise.all(resultsP)
    const dones = results.filter(isJust)
    if (dones.length < results.length) {
      dones.forEach(({ assetId }) => forceRmAsset({ assetId, assetDir }))
      return null
    }
    return dones as Tuple<AssetFileDesc, N> // must force it to tuple
  }
