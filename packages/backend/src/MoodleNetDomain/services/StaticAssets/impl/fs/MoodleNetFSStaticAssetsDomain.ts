import { isJust } from '@moodlenet/common/lib/utils/array'
import { DomainSetup, DomainStart, SubDomain } from '../../../../../lib/domain/types'
import { MoodleNetDomain } from '../../../../MoodleNetDomain'
import { AssetFileDescMap } from '../../types'
import { StaticAssetsIO } from '../types'

export type MoodleNetFSStaticAssetsDomain = SubDomain<MoodleNetDomain, 'StaticAssets', {}>

export const defaultFSStaticAssetSetup: DomainSetup<MoodleNetFSStaticAssetsDomain> = {
  'StaticAssets.PersistTempFilesAll': { kind: 'wrk' },
  'StaticAssets.DeleteAsset': { kind: 'wrk' },
}

export const defaultFSStaticAssetStartServices = ({ io }: { io: StaticAssetsIO }) => {
  const moodleNetFSStaticAssetsDomainStart: DomainStart<MoodleNetFSStaticAssetsDomain> = {
    'StaticAssets.PersistTempFilesAll': {
      init: async () => [
        async persistTmpFilesMap => {
          type K = keyof typeof persistTmpFilesMap
          const keys = Object.keys(persistTmpFilesMap) as K[]
          if (!keys.length) {
            return {} as AssetFileDescMap<K>
          }
          const results = await Promise.all(
            keys
              .map(k => persistTmpFilesMap[k])
              .map(({ tempFileId, uploadType }) => io.persistTemp({ tempFileId, uploadType })),
          )
          const dones = results.filter(isJust)
          if (dones.length < results.length) {
            dones.forEach(_ => io.delAsset(_.assetId))
            return null
          }
          const x = keys.reduce(
            (_persistedMap, key, index) => ({
              ..._persistedMap,
              [key]: dones[index]!,
            }),
            {} as AssetFileDescMap<K>,
          )
          return x
        },
      ],
    },
    'StaticAssets.DeleteAsset': {
      init: async () => [async ({ assetId }) => io.delAsset(assetId)],
    },
  }
  return moodleNetFSStaticAssetsDomainStart
}
