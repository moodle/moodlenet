import fetch from 'node-fetch'
import type { Readable } from 'stream'
import { env } from './init/env.mjs'

export async function localTikaExtract({
  file,
  mimeType,
}: {
  mimeType: string
  file: Readable | Buffer
}) {
  const contentResp = await fetch(env.tikaUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'X-Tika-Skip-Embedded': 'true',
      'Content-type': mimeType,
      'Accept': 'text/plain',
    },
  })
  if (contentResp.status !== 200) {
    throw new Error(`Tika failed with status ${contentResp.status}`)
  }
  const content = await contentResp.text()
  return content
}
