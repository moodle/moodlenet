import type { RpcFile } from '@moodlenet/core'
import { assertRpcFileReadable } from '@moodlenet/core'
import type { ResourceDoc } from '@moodlenet/core-domain/resource'
import { getResourceFile } from '@moodlenet/ed-resource/server'
import { fromBufferWithMime } from '@nosferatu500/textract'
import assert from 'assert'
import { isText } from 'istextorbinary'
import type { Readable } from 'stream'
import { promisify } from 'util'
import { env } from '../init/env.mjs'
import { getCompactBuffer } from './file/getCompactBuffer.mjs'
import mbz from './file/mbz.mjs'
import type { FileExtractor } from './file/types.mjs'
import type { ResourceTextAndDesc } from './types.mjs'

export async function extractTextFromFile(doc: ResourceDoc): Promise<ResourceTextAndDesc | null> {
  const fsItem = await getResourceFile(doc.id.resourceKey)
  assert(fsItem, `[extractResourceText] file not found for resource ${doc.id.resourceKey}`)
  const rpcFile = fsItem.rpcFile
  const readable = await assertRpcFileReadable(rpcFile)

  const compactedChuncksLength = Math.floor(env.cutContentToCharsAmount / 3)
  const compactedFileBuffer = await getCompactBuffer(
    await assertRpcFileReadable(rpcFile),
    compactedChuncksLength,
  )
  const fileIsText = isText(rpcFile.name, compactedFileBuffer)
  const resourceTextAndDesc: ResourceTextAndDesc | null = fileIsText
    ? {
        text: compactedFileBuffer.toString(),
        contentDesc: `content`,
        type: 'text file',
      }
    : await fileExtractor(readable, compactedFileBuffer, rpcFile).finally(() => readable.destroy())
  return resourceTextAndDesc
}

function fileExtractor(readable: Readable, compactedFileBuffer: Buffer, rpcFile: RpcFile) {
  const ext = (rpcFile.name.split('.').pop() ?? '').toLowerCase()
  const typeKind = (rpcFile.type.split('/').shift() ?? '').toLowerCase()
  const X: Record<string, FileExtractor> = {
    mbz,
  }
  const extractor = X[ext] ?? X[typeKind] ?? defaultExtractor
  return extractor({ readable, compactedFileBuffer, rpcFile })
}

const defaultExtractor: FileExtractor = async ({ compactedFileBuffer, rpcFile }) => {
  const pFromBufferWithMime = promisify<string, Buffer, string>(fromBufferWithMime)
  const text = await pFromBufferWithMime(rpcFile.type, compactedFileBuffer)
  return { text, contentDesc: 'extracted text', type: `${rpcFile.type} file type` }
}
