import { assertRpcFileReadable } from '@moodlenet/core'
import type { ResourceDoc } from '@moodlenet/core-domain/resource'
import { getResourceFile } from '@moodlenet/ed-resource/server'
import { fromBufferWithMime } from '@nosferatu500/textract'
import assert from 'assert'
import { isText } from 'istextorbinary'
import { promisify } from 'util'

export async function extractTextFromFile(doc: ResourceDoc): Promise<{ text: string }> {
  const fsItem = await getResourceFile(doc.id.resourceKey)
  assert(fsItem, `[extractResourceText] file not found for resource ${doc.id.resourceKey}`)
  const readable = await assertRpcFileReadable(fsItem.rpcFile)

  const fileBuffer = await (async () => {
    const _tmpBuffers = []
    for await (const data of readable) {
      _tmpBuffers.push(data)
    }
    return Buffer.concat(_tmpBuffers)
  })()
  const fileIsText = isText(fsItem.rpcFile.name, fileBuffer)
  const text = fileIsText
    ? fileBuffer.toString()
    : await promisify<string, Buffer, string>(fromBufferWithMime)(fsItem.rpcFile.type, fileBuffer)

  return { text }
}
