import { Shell, splitExtId, subPVal } from '@moodlenet/kernel'
import type { Readable } from 'stream'
import { Meta, MoodlenetBlobStoreExt, MoodlenetBlobStoreLib as Lib, WriteOptions } from './types'

export function blobStoreLib(shell: Shell) {
  const { extName: storeName } = splitExtId(shell.extId)

  const bsImplSubPVal = subPVal<MoodlenetBlobStoreExt>(shell)

  const exists: Lib['exists'] = async () => bsImplSubPVal('moodlenet.blob-store@0.1.10::exists')({ storeName })

  const create: Lib['create'] = () => bsImplSubPVal('moodlenet.blob-store@0.1.10::create')({ storeName })

  const read: Lib['read'] = (path: string) => bsImplSubPVal('moodlenet.blob-store@0.1.10::read')({ storeName, path })

  const meta: Lib['meta'] = (path: string) => bsImplSubPVal('moodlenet.blob-store@0.1.10::meta')({ storeName, path })

  const write: Lib['write'] = (
    path: string,
    data: Buffer | Readable,
    meta: Pick<Meta, 'mimeType'>,
    opts?: Partial<WriteOptions>,
  ) => bsImplSubPVal('moodlenet.blob-store@0.1.10::write')({ storeName, path, data, meta, opts })

  const lib: Lib = {
    read,
    meta,
    write,
    exists,
    create,
  }

  return lib
}
