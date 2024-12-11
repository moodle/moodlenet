import { ingestionOutcome } from '@moodle/module/resource-ingestion'
import { fetch } from 'undici'

export async function tikaIngestor({
  tikaUrl,
  body,
  mimeType,
}: {
  tikaUrl: string
  mimeType: string
  body: ArrayBuffer | AsyncIterable<Uint8Array> | Blob | Iterable<Uint8Array> | NodeJS.ArrayBufferView | string
}): Promise<ingestionOutcome> {
  const contentResp = await fetch(tikaUrl, {
    method: 'PUT',
    body,
    headers: {
      'X-Tika-Skip-Embedded': 'true',
      'Content-type': mimeType,
      'Accept': 'text/plain',
    },
  })
  if (contentResp.status !== 200) {
    // throw new Error(`Tika failed with status ${contentResp.status}`)
    return
  }
  const content = await contentResp.text()
  return content
}
