import type { RpcFile } from '@moodlenet/core'
import { assertRpcFileReadable } from '@moodlenet/core'
import type { ResourceDoc } from '@moodlenet/core-domain/resource'
import { getResourceFile } from '@moodlenet/ed-resource/server'
import assert from 'assert'
import { isText } from 'istextorbinary'
import { env } from '../init/env.mjs'
import defaultExtractor from './file/defaultExtractor.mjs'
import mbzExtractor from './file/ext/mbz.mjs'
import imageExtractor from './file/type/image.mjs'
import type { FileExtractor } from './file/types.mjs'
import type { ResourceExtraction } from './types.mjs'
import { getCompactBuffer } from './util.mjs'

export async function extractTextFromFile(doc: ResourceDoc): Promise<ResourceExtraction | null> {
  const fsItem = await getResourceFile(doc.id.resourceKey)
  assert(fsItem, `[extractResourceText] file not found for resource ${doc.id.resourceKey}`)
  const rpcFile = fsItem.rpcFile
  const readable = await assertRpcFileReadable(rpcFile)

  const compactedChuncksLength = Math.floor(env.cutContentToCharsAmount / 3)
  const { compactedFileBuffer } = await getCompactBuffer(
    await assertRpcFileReadable(rpcFile),
    compactedChuncksLength,
  )
  const fileIsText = isText(rpcFile.name, compactedFileBuffer)
  const resourceExtraction: ResourceExtraction | null = fileIsText
    ? {
        title: rpcFile.name,
        content: compactedFileBuffer.toString(),
        contentDesc: `content`,
        type: 'text file',
        provideImage: undefined,
      }
    : await fileExtractor({ rpcFile })
        .catch(err => {
          console.error(
            `[extractResourceText] file extraction failed for resource ${doc.id.resourceKey}`,
            err,
          )
          return null
        })
        .finally(() => readable.destroy())

  return resourceExtraction
}

function fileExtractor({ rpcFile }: { rpcFile: RpcFile }) {
  const ext = (rpcFile.name.split('.').pop() ?? '').toLowerCase()
  const extensionExtractor: Record<string, FileExtractor> = {
    mbz: mbzExtractor,
  }

  const typeKind = (rpcFile.type.split('/').shift() ?? '').toLowerCase()
  const typeKindExtractor: Record<string, FileExtractor> = {
    image: imageExtractor,
  }

  const extractor = extensionExtractor[ext] ?? typeKindExtractor[typeKind] ?? (async () => null)

  return extractor({ rpcFile })
    .catch(() => null)
    .then(extr => extr ?? defaultExtractor({ rpcFile }))
    .catch(() => null)
}
