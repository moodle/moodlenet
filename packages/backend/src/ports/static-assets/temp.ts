import { isJust } from '@moodlenet/common/lib/utils/array'
import { Readable } from 'stream'
import { StaticAssetsIO } from '../../adapters/http/staticAssets/impl/types'
import { PersistTmpFileReq, TempFileDesc } from '../../adapters/staticAssets/types'
import { QMCommand, QMModule } from '../../lib/qmino'

export const persistAll = QMCommand(
  ({ persistTmpFilesReqs }: { persistTmpFilesReqs: PersistTmpFileReq[] }) =>
    async ({ persistTemp, delAsset }: Pick<StaticAssetsIO, 'persistTemp' | 'delAsset'>) => {
      if (!persistTmpFilesReqs.length) {
        return []
      }
      const results = await Promise.all(
        persistTmpFilesReqs.map(({ tempFileId, uploadType }) => persistTemp({ tempFileId, uploadType })),
      )
      const dones = results.filter(isJust)
      if (dones.length < results.length) {
        dones.forEach(_ => delAsset(_.assetId))
        return null
      }
      return results as any // FIXME: cannot hook to Tuple type !
    },
)

export const create = QMCommand(
  ({ stream, tempFileDesc }: { stream: Readable; tempFileDesc: TempFileDesc }) =>
    async ({ createTemp }: Pick<StaticAssetsIO, 'createTemp'>) => {
      const result = await createTemp({ stream, tempFileDesc })
      return result
    },
)

QMModule(module)
