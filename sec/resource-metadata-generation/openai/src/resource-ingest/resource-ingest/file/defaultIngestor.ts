import { assertRpcFileReadable } from '@moodlenet/core'
import { tikaIngest } from '../../tikaIngest'
import type { FileIngestor } from './types'

const defaultIngestor: FileIngestor = async ({ rpcFile }) => {
  // const pFromBufferWithMime = promisify<string, Buffer, string>(fromBufferWithMime)
  const content = await tikaIngest({
    file: await assertRpcFileReadable(rpcFile),
    mimeType: rpcFile.type,
  })
  // const content = await pFromBufferWithMime(rpcFile.type, fileBuffer).catch(() => undefined)
  return {
    title: rpcFile.name,
    content,
    contentDesc: 'ingested text',
    type: `${rpcFile.type} file type`,
    provideImage: undefined,
  }
}

export default defaultIngestor
