import { Readable } from 'stream'
import { Tuple } from 'tuple-type'
import { ns } from '../../lib/ns/namespace'
import { plug } from '../../lib/plug'
import { AssetFileDesc, PersistTmpFileReq, TempAssetDesc, TempFileDesc } from './types'

// persist temps

export const persistTempAssetsAdapter = plug<
  <N extends number>(_: { persistTmpFilesReqs: Tuple<PersistTmpFileReq, N> }) => Promise<null | Tuple<AssetFileDesc, N>>
>(ns(module, 'persist-temp-assets-adapter'))

export const persistTempAssets = plug(
  ns(module, 'persist-temp-assets'),
  async ({ persistTmpFilesReqs }: { persistTmpFilesReqs: PersistTmpFileReq[] }) => {
    if (!persistTmpFilesReqs.length) {
      return []
    }
    // console.log({ persistTmpFilesReqs })
    const results = persistTempAssetsAdapter({ persistTmpFilesReqs })
    return results
  },
)

// create temp

export const createTempAssetAdapter = plug<
  (_: { stream: Readable; tempFileDesc: TempFileDesc }) => Promise<string | TempAssetDesc>
>(ns(module, 'create-temp-asset-adapter'))

export const createTempAsset = plug(
  ns(module, 'create-temp-asset'),
  async ({ stream, tempFileDesc }: { stream: Readable; tempFileDesc: TempFileDesc }) => {
    const tempAssetDescOrError = await createTempAssetAdapter({ stream, tempFileDesc })
    return tempAssetDescOrError
  },
)
