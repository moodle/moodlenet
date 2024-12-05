import { getReadableLocalAsset } from '@moodle/lib-storage-local-fs'
import { extractionOutcome } from '@moodle/module/resource-extraction'
import { accessibleAsset } from '@moodle/module/storage'
import { fetch } from 'undici'
import externalAssetExtractor from './externalAssetExtractor'

export async function tikaExtractAsset({
  tikaUrl,
  asset,
}: {
  tikaUrl: string
  asset: accessibleAsset
}): Promise<extractionOutcome> {
  if (asset.type === 'external') {
    return externalAssetExtractor({ asset, tikaUrl })
  }

  return [
    true,
    {
      title: asset.name,
      content: await tikaExtract({
        tikaUrl,
        body: await getReadableLocalAsset(asset),
        mimeType: asset.mimetype,
      }),
      image: null,
      extractionKind: `${asset.mimetype} file type`,
    },
  ]
}

export async function tikaExtract({
  tikaUrl,
  body,
  mimeType,
}: {
  tikaUrl: string
  mimeType: string
  body: ArrayBuffer | AsyncIterable<Uint8Array> | Blob | Iterable<Uint8Array> | NodeJS.ArrayBufferView | string
}) {
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
    throw new Error(`Tika failed with status ${contentResp.status}`)
  }
  const content = await contentResp.text()
  return content
}
