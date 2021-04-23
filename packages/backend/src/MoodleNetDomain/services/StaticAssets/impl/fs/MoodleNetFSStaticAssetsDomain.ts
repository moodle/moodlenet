import { DomainSetup, DomainStart, SubDomain } from '../../../../../lib/domain/types'
import { MoodleNetDomain } from '../../../../MoodleNetDomain'
import { StaticAssetsIO } from '../types'

export type MoodleNetFSStaticAssetsDomain = SubDomain<MoodleNetDomain, 'StaticAssets', {}>

export const defaultFSStaticAssetSetup: DomainSetup<MoodleNetFSStaticAssetsDomain> = {
  'StaticAssets.PersistTempFile': { kind: 'wrk' },
}

export const defaultFSStaticAssetStartServices = ({ io }: { io: StaticAssetsIO }) => {
  const moodleNetFSStaticAssetsDomainStart: DomainStart<MoodleNetFSStaticAssetsDomain> = {
    'StaticAssets.PersistTempFile': {
      init: async () => [
        ({ rebaseName, tempFileId }) =>
          io.persistTemp({ tempFileId, rebaseName }).then(persistResult =>
            !persistResult
              ? {
                  done: false,
                  reason: 'not found',
                }
              : {
                  done: true,
                  assetId: persistResult.id,
                  fileDesc: persistResult.originalDesc,
                },
          ),
      ],
    },
  }
  return moodleNetFSStaticAssetsDomainStart
}
