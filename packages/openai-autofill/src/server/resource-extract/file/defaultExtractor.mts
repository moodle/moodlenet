import { fromBufferWithMime } from '@nosferatu500/textract'
import { promisify } from 'util'
import type { FileExtractor } from './types.mjs'

const defaultExtractor: FileExtractor = async ({ fileBuffer, rpcFile }) => {
  const pFromBufferWithMime = promisify<string, Buffer, string>(fromBufferWithMime)
  const content = await pFromBufferWithMime(rpcFile.type, fileBuffer).catch(() => undefined)
  return {
    title: rpcFile.name,
    content,
    contentDesc: 'extracted text',
    type: `${rpcFile.type} file type`,
    provideImage: undefined,
  }
}

export default defaultExtractor
