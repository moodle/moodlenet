import type { AssetInfo } from '@moodlenet/component-library/common'
import { publicFilesHttp } from './init/fs.mjs'
import type { Image } from './types.mjs'

export function getImageUrl(image: Image | undefined | null) {
  if (!image) {
    return null
  }
  const imageUrl =
    image.kind === 'file'
      ? publicFilesHttp.getFileUrl({ directAccessId: image.directAccessId })
      : image.url

  return imageUrl
}

export function getImageAssetInfo(image: Image | undefined | null): AssetInfo | null {
  const location = getImageUrl(image)
  if (!(image && location)) {
    return null
  }
  const assetInfo: AssetInfo = {
    location,
    credits: image.credits ?? null,
  }

  return assetInfo
}
