import { UploadType } from '@moodlenet/common/lib/staticAsset/lib'
import { Readable } from 'stream'
import { AssetFileDesc, AssetId, TempFileDesc, TempFileId } from '../types'

export interface StaticAssetsIO {
  getAsset: (assetId: AssetId) => Promise<Readable | null>
  createTemp: (_: { stream: Readable; tempFileDesc: TempFileDesc }) => Promise<TempFileId>
  persistTemp: (_: { tempFileId: TempFileId; uploadType: UploadType }) => Promise<AssetFileDesc | null>
  delTemp: (tempFileId: TempFileId) => Promise<void>
  delAsset: (assetId: AssetId) => Promise<void>
  delOldTemps: (_: { olderThanSecs: number }) => Promise<number>
}
