import { fromBufferWithMime } from '@nosferatu500/textract'
import { promisify } from 'util'
import type { FileExtractor } from './types.mjs'

const defaultExtractor: FileExtractor = async ({ compactedFileBuffer, rpcFile }) => {
  const pFromBufferWithMime = promisify<string, Buffer, string>(fromBufferWithMime)
  const text = await pFromBufferWithMime(rpcFile.type, compactedFileBuffer).catch(() => null)
  if (!text) {
    return null
  }
  return {
    text,
    contentDesc: 'extracted text',
    type: `${rpcFile.type} file type`,
    provideImage: undefined,
  }
}

export default defaultExtractor
