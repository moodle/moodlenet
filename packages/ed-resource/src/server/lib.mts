import { publicFilesHttp } from './init/fs.mjs'
import type { Image } from './types.mjs'

export function getImageUrl(image: Image) {
  const imageUrl =
    image.kind === 'file'
      ? publicFilesHttp.getFileUrl({ directAccessId: image.directAccessId })
      : image.url

  return imageUrl
}
