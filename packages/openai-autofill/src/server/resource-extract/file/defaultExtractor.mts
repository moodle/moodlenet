import { assertRpcFileReadable } from '@moodlenet/core'
import { tikaExtract } from '../../tikaExtract.mjs'
import type { FileExtractor } from './types.mjs'

const defaultExtractor: FileExtractor = async ({ rpcFile }) => {
  // const pFromBufferWithMime = promisify<string, Buffer, string>(fromBufferWithMime)
  const content = await tikaExtract({
    file: await assertRpcFileReadable(rpcFile),
    mimeType: rpcFile.type,
  })
  // const content = await pFromBufferWithMime(rpcFile.type, fileBuffer).catch(() => undefined)
  return {
    title: rpcFile.name,
    content,
    contentDesc: 'extracted text',
    type: `${rpcFile.type} file type`,
    provideImage: undefined,
  }
}

export default defaultExtractor
