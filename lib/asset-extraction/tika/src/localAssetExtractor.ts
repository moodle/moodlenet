import { getReadableLocalAsset } from '@moodle/lib-storage-local-fs'
import { assetExtractor } from '../../../../sec/resource-extraction/tika/src/types'

const defaultExtractor: assetExtractor<'local'> = async ({ asset, env }) => {
  // const pFromBufferWithMime = promisify<string, Buffer, string>(fromBufferWithMime)
  const content = await tikaExtract({
    body: await getReadableLocalAsset(asset),
    mimeType: asset.mimetype,
    env,
  })
  // const content = await pFromBufferWithMime(rpcFile.type, fileBuffer).catch(() => undefined)
  return [
    true,
    {
      title: asset.name,
      content,
      image: null,
      extractionKind: `${asset.mimetype} file type`,
    },
  ]
}

export default defaultExtractor
