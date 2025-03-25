import { eduResourceIngestionOutcome } from '@moodle/module/resource-ingestion'
import { fetch } from 'undici'

const ingestionImpl = ({ mimeType }: { mimeType: string }) => `tikaIngestion__gets__only__content : ${mimeType} file type`
export async function tikaIngestion__gets__only__content({
  tikaServerUrl,
  body,
  mimeType,
}: {
  tikaServerUrl: string
  mimeType: string
  body: ArrayBuffer | AsyncIterable<Uint8Array> | Blob | Iterable<Uint8Array> | NodeJS.ArrayBufferView | string
}): Promise<eduResourceIngestionOutcome> {
  const contentResp = await fetch(tikaServerUrl, {
    method: 'PUT',
    body,
    headers: {
      'X-Tika-Skip-Embedded': 'true',
      'Content-type': mimeType,
      'Accept': 'text/plain',
    },
    duplex: 'half',
  })

  if (contentResp.status !== 200) {
    // throw new Error(`Tika failed with status ${contentResp.status}`)
    return {
      outcome: 'undoable',
      ingestionImpl: ingestionImpl({ mimeType }),
      details: { contentResp },
      reason: `Tika failed with status ${contentResp.status} text: ${await contentResp.text()}`,
    }
  }
  const content = (await contentResp.text()).trim()
  return { outcome: 'succeed', content, image: null, ingestionImpl: `tika ingestion of ${mimeType} file type`, title: null }
}
