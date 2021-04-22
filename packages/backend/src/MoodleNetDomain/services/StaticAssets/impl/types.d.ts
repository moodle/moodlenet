import { Readable } from 'stream'

type AssetFileFullPath = {
  path: string[]
  name: string
  ulid: Ulid | null
}
type Ulid = string
export interface StaticAssetsIO {
  getAsset: (path: AssetFileFullPath | string) => Promise<Readable | null>
  createTemp: (_: { stream: Readable; fileDesc: FileDesc }) => Promise<TempFileId>
  persistTemp: (tempFileId: string, path: AssetFileFullPath) => Promise<FileDesc | null>
  delTemp: (tempFileId: string) => Promise<void>
  delOldTemps: (_: { olderThanSecs: number }) => Promise<number>
}

type TempFileId = string
export type FileDesc = {
  originalSize: number
  originalName: string | null
  type: string | null
}
