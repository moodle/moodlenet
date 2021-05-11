import { isJust } from '@moodlenet/common/lib/utils/array'
import { StaticAssetsIO } from '../types'

export const defaultFSStaticAssetStartServices = ({ io }: { io: StaticAssetsIO }) => ({
  'StaticAssets.PersistTempFilesAll': {
    init: async () => [
      async persistTmpFilesReqs => {
        if (!persistTmpFilesReqs.length) {
          return []
        }
        const results = await Promise.all(
          persistTmpFilesReqs.map(({ tempFileId, uploadType }) => io.persistTemp({ tempFileId, uploadType })),
        )
        const dones = results.filter(isJust)
        if (dones.length < results.length) {
          dones.forEach(_ => io.delAsset(_.assetId))
          return null
        }
        return results as any // FIXME: cannot hook to Tuple type !
      },
    ],
  },
  'StaticAssets.DeleteAsset': {
    init: async () => [async ({ assetId }) => io.delAsset(assetId)],
  },
})
