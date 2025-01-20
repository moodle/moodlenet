import type { RpcFile } from '@moodlenet/core'
import { assertRpcFileReadable } from '@moodlenet/core'
import type { ResourceDoc } from '@moodlenet/core-domain/resource'
import { getResourceFile } from '@moodlenet/ed-resource/server'
import assert from 'assert'
import { isText } from 'istextorbinary'
import { env } from '../init/env'
import defaultIngestor from './file/defaultIngestor'
import mbzIngestor from './file/ext/mbz'
import imageIngestor from './file/type/image'
import type { FileIngestor } from './file/types'
import type { resourceIngestionMetadata } from './types'
import { getCompactBuffer } from './util'

export async function ingestTextFromFile(doc: ResourceDoc): Promise<resourceIngestionMetadata | null> {
  const fsItem = await getResourceFile(doc.id.resourceKey)
  assert(fsItem, `[ingestResourceText] file not found for resource ${doc.id.resourceKey}`)
  const rpcFile = fsItem.rpcFile
  const readable = await assertRpcFileReadable(rpcFile)

  const compactedChuncksLength = Math.floor(env.cutContentToCharsAmount / 3)
  const { compactedFileBuffer } = await getCompactBuffer(await assertRpcFileReadable(rpcFile), compactedChuncksLength)
  const fileIsText = isText(rpcFile.name, compactedFileBuffer)
  const resourceIngestion: resourceIngestionMetadata | null = fileIsText
    ? {
        title: rpcFile.name,
        content: compactedFileBuffer.toString(),
        contentDesc: `content`,
        type: 'text file',
        provideImage: undefined,
      }
    : await fileIngestor({ rpcFile })
        .catch(err => {
          console.error(`[ingestResourceText] file ingestion failed for resource ${doc.id.resourceKey}`, err)
          return null
        })
        .finally(() => readable.destroy())

  return resourceIngestion
}

function fileIngestor({ rpcFile }: { rpcFile: RpcFile }) {
  const ext = (rpcFile.name.split('.').pop() ?? '').toLowerCase()
  const extensionIngestor: Record<string, FileIngestor> = {
    mbz: mbzIngestor,
  }

  const typeKind = (rpcFile.type.split('/').shift() ?? '').toLowerCase()
  const typeKindIngestor: Record<string, FileIngestor> = {
    image: imageIngestor,
  }

  const ingestor = extensionIngestor[ext] ?? typeKindIngestor[typeKind] ?? (async () => null)

  return ingestor({ rpcFile })
    .catch(() => null)
    .then(extr => extr ?? defaultIngestor({ rpcFile }))
    .catch(() => null)
}
