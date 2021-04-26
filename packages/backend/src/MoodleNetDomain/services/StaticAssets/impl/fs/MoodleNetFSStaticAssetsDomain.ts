import { DomainSetup, DomainStart, SubDomain } from '../../../../../lib/domain/types'
import { MoodleNetDomain } from '../../../../MoodleNetDomain'
import { StaticAssetsIO } from '../types'

export type MoodleNetFSStaticAssetsDomain = SubDomain<MoodleNetDomain, 'StaticAssets', {}>

export const defaultFSStaticAssetSetup: DomainSetup<MoodleNetFSStaticAssetsDomain> = {
  'StaticAssets.PersistTemp': { kind: 'wrk' },
  'StaticAssets.DeleteAsset': { kind: 'wrk' },
}

export const defaultFSStaticAssetStartServices = ({ io }: { io: StaticAssetsIO }) => {
  const moodleNetFSStaticAssetsDomainStart: DomainStart<MoodleNetFSStaticAssetsDomain> = {
    'StaticAssets.PersistTemp': {
      init: async () => [
        async ({ tempFileId, uploadType }) => {
          const persistResult = await io.persistTemp({ tempFileId, uploadType })
          if (!persistResult) {
            return {
              done: false,
              reason: 'not found',
            }
          }
          const { assetFileDesc } = persistResult
          return {
            done: true,
            assetFileDesc,
          }
        },
      ],
    },
    'StaticAssets.DeleteAsset': {
      init: async () => [async ({ assetId }) => io.delAsset(assetId)],
    },
  }
  return moodleNetFSStaticAssetsDomainStart
}
