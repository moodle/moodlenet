import type { Content, Image, ResourceMeta, StateName } from '@moodlenet/core-domain/resource'
import { getImageAssetInfo } from '../../lib.mjs'
import type { ResourceEntityDoc } from '../../types.mjs'

export function entityDoc2StateMeta(resourceEntity: ResourceEntityDoc): [StateName, ResourceMeta] {
  const resourceMeta: ResourceMeta = {
    references: {
      content: content(resourceEntity.content),
      image: image(resourceEntity.image),
      id: { resourceKey: resourceEntity._key },
    },
    title: resourceEntity.title,
    description: resourceEntity.description,
    learningOutcomes: resourceEntity.learningOutcomes.map(value => ({ value })),
    language: resourceEntity.language ? { code: resourceEntity.language } : undefined,
    level: resourceEntity.level ? { code: resourceEntity.level } : undefined,
    license: resourceEntity.license ? { code: resourceEntity.license } : undefined,
    subject: resourceEntity.subject ? { code: resourceEntity.subject } : undefined,
    type: resourceEntity.type ? { code: resourceEntity.type } : undefined,
    originalPublicationInfo: Number(resourceEntity.year)
      ? { year: Number(resourceEntity.year), month: Number(resourceEntity.month || 1) }
      : undefined,
  }

  return [resourceEntity.lifecycleState, resourceMeta]
}

function content(content: ResourceEntityDoc['content']): Content {
  return content.kind === 'file'
    ? { kind: 'file', ref: content }
    : content.kind === 'link'
    ? { kind: 'link', ref: content, url: content.url }
    : (() => {
        throw 'never'
      })()
}

function image(image: ResourceEntityDoc['image'] | null): Image | null {
  if (!image) {
    return null
  }
  if (image.kind === 'file') {
    const assetInfo = getImageAssetInfo(image)
    if (!assetInfo) {
      return null
    }
    return { kind: 'file', ref: image }
  } else {
    return { kind: 'url', ref: image, url: image.url }
  }
}
