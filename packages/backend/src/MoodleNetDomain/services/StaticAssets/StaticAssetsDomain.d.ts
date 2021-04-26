import { WrkDef } from '../../../lib/domain/wrk'
import { AssetFileDesc, AssetId, TempFileId, UploadType } from './types'

export type StaticAssets = {
  PersistTempFilesAll: WrkDef<
    (_: { uploadType: UploadType; tempFileId: TempFileId }[]) => Promise<null | AssetFileDesc[]>
  >
  DeleteAsset: WrkDef<(_: { assetId: AssetId }) => Promise<any>>
}
