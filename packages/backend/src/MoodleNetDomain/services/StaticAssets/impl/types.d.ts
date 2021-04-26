import { Readable } from 'stream'
import { AssetFileDesc, AssetId, TempFileDesc, TempFileId, UploadType } from '../types'

export interface StaticAssetsIO {
  getAsset: (assetId: AssetId) => Promise<Readable | null>
  createTemp: (_: { stream: Readable; tempFileDesc: TempFileDesc }) => Promise<TempFileId>
  persistTemp: (_: {
    tempFileId: TempFileId
    uploadType: UploadType
  }) => Promise<{ assetFileDesc: AssetFileDesc } | null>
  delTemp: (tempFileId: TempFileId) => Promise<void>
  delAsset: (assetId: AssetId) => Promise<void>
  delOldTemps: (_: { olderThanSecs: number }) => Promise<number>
}
