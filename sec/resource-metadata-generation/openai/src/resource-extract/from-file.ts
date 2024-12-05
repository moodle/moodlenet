import type { RpcFile } from '@moodlenet/core'
import { assertRpcFileReadable } from '@moodlenet/core'
import type { ResourceDoc } from '@moodlenet/core-domain/resource'
import { getResourceFile } from '@moodlenet/ed-resource/server'
import assert from 'assert'
import { isText } from 'istextorbinary'
import { env } from '../init/env'
import defaultExtractor from './file/defaultExtractor'
import mbzExtractor from './file/ext/mbz'
import imageExtractor from './file/type/image'
import type { FileExtractor } from './file/types'
import type { resourceExtractionMetadata } from './types'
import { getCompactBuffer } from './util'

export async function extractTextFromFile(doc: ResourceDoc): Promise<resourceExtractionMetadata | null> {
  const fsItem = await getResourceFile(doc.id.resourceKey)
  assert(fsItem, `[extractResourceText] file not found for resource ${doc.id.resourceKey}`)
  const rpcFile = fsItem.rpcFile
  const readable = await assertRpcFileReadable(rpcFile)

  const compactedChuncksLength = Math.floor(env.cutContentToCharsAmount / 3)
  const { compactedFileBuffer } = await getCompactBuffer(await assertRpcFileReadable(rpcFile), compactedChuncksLength)
  const fileIsText = isText(rpcFile.name, compactedFileBuffer)
  const resourceExtraction: resourceExtractionMetadata | null = fileIsText
    ? {
        title: rpcFile.name,
        content: compactedFileBuffer.toString(),
        contentDesc: `content`,
        type: 'text file',
        provideImage: undefined,
      }
    : await fileExtractor({ rpcFile })
        .catch(err => {
          console.error(`[extractResourceText] file extraction failed for resource ${doc.id.resourceKey}`, err)
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
