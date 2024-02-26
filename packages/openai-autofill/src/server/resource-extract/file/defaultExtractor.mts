import { localTikaExtract } from '../../localTikaExtract.mjs'
import type { FileExtractor } from './types.mjs'

const defaultExtractor: FileExtractor = async ({ rpcFile, readable }) => {
  // const pFromBufferWithMime = promisify<string, Buffer, string>(fromBufferWithMime)
  const content = await localTikaExtract({ file: readable, mimeType: rpcFile.type })
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
