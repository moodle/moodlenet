import type { resource } from '@moodlenet/core-domain'
import type { ResourceDataType } from '@moodlenet/ed-resource/server'
import { getImageAssetInfo } from '@moodlenet/ed-resource/server'

// type ResourceEntityDoc = Exclude<Awaited<ReturnType<typeof getResource>>, undefined>['entity']
type ResourceEntityDoc = ResourceDataType
export function draft(
  resourceRecord: ResourceEntityDoc,
): ['^^^NO-CONTENT^^^', null] | [resource.lifecycle.StateName, resource.lifecycle.DraftMeta] {
  const content = toContent(resourceRecord.content)

  // FIXME: this should never happen if db migration
  // and cleanup(delete resources without content) is done correctly
  if (!content) {
    return ['^^^NO-CONTENT^^^', null]
  }
  const image = toImage(resourceRecord.image)
  const draft: resource.lifecycle.DraftMeta = {
    title: resourceRecord.title,
    description: resourceRecord.description,
    content,
    image,
    learningOutcomes: resourceRecord.learningOutcomes,
    language: resourceRecord.language,
    level: resourceRecord.level,
    license: resourceRecord.license,
    month: resourceRecord.month,
    subject: resourceRecord.subject,
    type: resourceRecord.type,
    year: resourceRecord.year,
  }

  return [resourceRecord.lifecycleState, draft]
}

function toContent(
  content: ResourceEntityDoc['content'],
): resource.lifecycle.ResourceContent | null {
  if (content.kind === 'file') {
    return { kind: 'file', content }
  } else {
    return { kind: 'link', url: content.url }
  }
}

function toImage(image: ResourceEntityDoc['image'] | null): resource.lifecycle.Image | null {
  if (!image) {
    return null
  }
  if (image.kind === 'file') {
    const assetInfo = getImageAssetInfo(image)
    if (!assetInfo) {
      return null
    }
    return { kind: 'file', image }
  } else {
    return { kind: 'url', url: image.url, credits: image.credits }
  }
}
