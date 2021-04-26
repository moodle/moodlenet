import { WrkDef } from '../../../lib/domain/wrk'
import { AssetFileDesc, AssetId, TempFileId, UploadType } from './types'

export type StaticAssets = {
  PersistTemp: WrkDef<
    (_: {
      uploadType: UploadType
      tempFileId: TempFileId
    }) => Promise<{ assetFileDesc: AssetFileDesc; done: true } | { reason: string; done: false }>
  >
  DeleteAsset: WrkDef<(_: { assetId: AssetId }) => Promise<any>>
}
