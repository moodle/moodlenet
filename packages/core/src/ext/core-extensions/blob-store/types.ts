import { ExtDef, SubTopo } from '@moodlenet/kernel'
import { Readable } from 'stream'

export type MoodlenetBlobStoreLib = {
  read(path: string): Promise<Readable | null>
  meta(path: string): Promise<Meta | undefined>
  write(
    path: string,
    data: Buffer | Readable,
    meta: Pick<Meta, 'mimeType'>,
    opts?: Partial<WriteOptions> | undefined,
  ): Promise<{ done: true; meta: Meta } | { done: false; err: PutError }>
  create(): Promise<void>
  exists(): Promise<boolean>
}

export type MoodlenetBlobStoreExt = ExtDef<
  'moodlenet.blob-store',
  '0.1.10',
  {
    meta: MetaSub
    read: ReadSub
    write: WriteSub
    create: CreateSub
    exists: ExistsSub
  }
>
export type GenericError = {
  message: string
}
export type PutError = GenericError

export type MetaMimeType = string

export type CreateSub = SubTopo<{ storeName: string }, void>
export type ExistsSub = SubTopo<{ storeName: string }, boolean>

export type Meta = {
  mimeType: MetaMimeType
}

export type WriteOptions = {
  expiresSecs: number
}
export type WriteSub = SubTopo<
  {
    storeName: string
    path: string
    data: Buffer | Readable
    meta: Pick<Meta, 'mimeType'>
    opts?: Partial<WriteOptions>
  },
  { done: true; meta: Meta } | { done: false; err: PutError }
>

export type MetaSub = SubTopo<{ storeName: string; path: string }, Meta | undefined>

export type ReadSub = SubTopo<{ storeName: string; path: string }, Readable | null>
