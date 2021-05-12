import { Readable } from 'stream'
import { Tuple } from 'tuple-type'
import { QMCommand, QMModule } from '../../lib/qmino'
import { AssetFileDesc, PersistTmpFileReq, TempAssetDesc, TempFileDesc } from './types'

// persist temps

export type PersistTempAssetsAdapter = {
  persistTemps: <N extends number>(_: {
    persistTmpFilesReqs: Tuple<PersistTmpFileReq, N>
  }) => Promise<null | Tuple<AssetFileDesc, N>>
}
export const persistTempAssets = QMCommand(
  ({ persistTmpFilesReqs }: { persistTmpFilesReqs: PersistTmpFileReq[] }) =>
    async ({ persistTemps }: PersistTempAssetsAdapter) => {
      if (!persistTmpFilesReqs.length) {
        return []
      }
      console.log({ persistTmpFilesReqs })
      const results = persistTemps({ persistTmpFilesReqs })
      return results
    },
)

// create temp

export type CreateTempAdapter = {
  createTempAsset: (_: { stream: Readable; tempFileDesc: TempFileDesc }) => Promise<string | TempAssetDesc>
}
export const createTemp = QMCommand(
  ({ stream, tempFileDesc }: { stream: Readable; tempFileDesc: TempFileDesc }) =>
    async ({ createTempAsset }: CreateTempAdapter) => {
      const tempAssetDescOrError = await createTempAsset({ stream, tempFileDesc })
      return tempAssetDescOrError
    },
)

QMModule(module)
