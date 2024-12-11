import { ingestionOutcome } from '@moodle/module/resource-ingestion'
import { fetch } from 'undici'

export async function tikaIngestion__gets__only__content({
  tikaServerUrl,
  body,
  mimeType,
}: {
  tikaServerUrl: string
  mimeType: string
  body: ArrayBuffer | AsyncIterable<Uint8Array> | Blob | Iterable<Uint8Array> | NodeJS.ArrayBufferView | string
}): Promise<ingestionOutcome> {
  const contentResp = await fetch(tikaServerUrl, {
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
    return {
      outcome: 'failed',
      reason: { message: `Tika failed with status ${contentResp.status}`, text: await contentResp.text() },
    }
  }
  const content = await contentResp.text()
  return { outcome: 'succeed', content, image: null, ingestionKind: `tika ingestion of ${mimeType} file type`, title: null }
}
