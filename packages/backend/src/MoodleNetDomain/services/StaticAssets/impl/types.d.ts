import { Readable } from 'stream'

export interface StaticAssetsIO {
  getAsset: (assetId: AssetId) => Promise<Readable | null>
  createTemp: (_: { stream: Readable; fileDesc: TempFileDesc }) => Promise<TempFileId>
  persistTemp: (_: {
    tempFileId: TempFileId
    rebaseName?: string
  }) => Promise<{ originalDesc: TempFileDesc; id: AssetId } | null>
  delTemp: (tempFileId: TempFileId) => Promise<void>
  delOldTemps: (_: { olderThanSecs: number }) => Promise<number>
}

type Ulid = string
type AssetId = string
type TempFileId = string

export type TempFileDesc = {
  resizedWebImageExt: string | null
  size: number
  filename: { base: string; ext: string | null } | null
  mimetype: string | null
  lastModifiedDate?: Date | null
  //hash: {type: 'sha1' | 'md5' | 'sha256',digest:string}
} //as from Formidable.File
