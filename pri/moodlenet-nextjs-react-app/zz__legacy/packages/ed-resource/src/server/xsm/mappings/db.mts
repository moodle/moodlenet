import type * as xsm from '@moodlenet/core-domain/resource'
import { DEFAULT_CONTEXT } from '@moodlenet/core-domain/resource'
import { getImageAssetInfo } from '../../lib.mjs'
import type { ResourceEntityDoc } from '../../types.mjs'
import type { ResourceDataTypeMeta } from './types.mjs'

export function doc_2_persistentContext(resourceEntity: ResourceEntityDoc): xsm.PersistentContext {
  const resourceDoc: xsm.ResourceDoc = {
    content: docContent_2_xsm(resourceEntity.content),
    image: docImage_2_xsm(resourceEntity.image),
    id: { resourceKey: resourceEntity._key },
    meta: {
      title: resourceEntity.title,
      description: resourceEntity.description,
      learningOutcomes: resourceEntity.learningOutcomes.map(value => ({
        sentence: value.sentence,
        value,
      })),
      language: resourceEntity.language ? { code: resourceEntity.language } : null,
      level: resourceEntity.level ? { code: resourceEntity.level } : null,
      license: resourceEntity.license ? { code: resourceEntity.license } : null,
      subject: resourceEntity.subject ? { code: resourceEntity.subject } : null,
      type: resourceEntity.type ? { code: resourceEntity.type } : null,
      originalPublicationInfo: Number(resourceEntity.year)
        ? { year: Number(resourceEntity.year), month: Number(resourceEntity.month || 1) }
        : null,
    },
  }

  return {
    ...DEFAULT_CONTEXT,
    ...resourceEntity.persistentContext,
    doc: resourceDoc,
  }
}

export function meta_2_db(meta: xsm.ResourceMeta): ResourceDataTypeMeta {
  const resourceDataTypeMeta: ResourceDataTypeMeta = {
    title: meta.title,
    description: meta.description,
    learningOutcomes: meta.learningOutcomes && meta.learningOutcomes.map(({ value }) => value),
    language: meta.language?.code ?? '',
    level: meta.level?.code ?? '',
    license: meta.license?.code ?? '',
    subject: meta.subject?.code ?? '',
    type: meta.type?.code ?? '',
    ...(meta.originalPublicationInfo
      ? {
          year: String(meta.originalPublicationInfo.year),
          month: String(meta.originalPublicationInfo?.month),
        }
      : { year: '', month: '' }),
  }

  return resourceDataTypeMeta
}

export function docContent_2_xsm(content: ResourceEntityDoc['content']): xsm.Content {
  return content.kind === 'file'
    ? { kind: 'file', ref: content }
    : content.kind === 'link'
      ? { kind: 'link', ref: content, url: content.url }
      : (() => {
          throw new TypeError('never')
        })()
}

export function docImage_2_xsm(image: ResourceEntityDoc['image'] | null): xsm.Image | null {
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
