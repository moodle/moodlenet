import { Tuple } from 'tuple-type'
import { WrkDef } from '../../lib/domain/wrk'
import { AssetFileDesc, AssetId, PersistTmpFileReq } from './types'

export type StaticAssets = {
  PersistTempFilesAll: WrkDef<
    <N extends number>(_: Tuple<PersistTmpFileReq, N>) => Promise<null | Tuple<AssetFileDesc, N>>
  >
  DeleteAsset: WrkDef<(_: { assetId: AssetId }) => Promise<any>>
}
