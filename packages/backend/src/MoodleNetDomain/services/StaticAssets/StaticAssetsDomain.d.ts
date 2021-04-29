import { WrkDef } from '../../../lib/domain/wrk'
import { AssetFileDescMap, AssetId, PersistTmpFileReqsMap } from './types'

export type StaticAssets = {
  PersistTempFilesAll: WrkDef<<K extends string>(_: PersistTmpFileReqsMap<K>) => Promise<null | AssetFileDescMap<K>>>
  DeleteAsset: WrkDef<(_: { assetId: AssetId }) => Promise<any>>
}
