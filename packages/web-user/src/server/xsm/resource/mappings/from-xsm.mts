import type { resource } from '@moodlenet/core-domain'
import type { ResourceDataType } from '@moodlenet/ed-resource/server'

export function patch(
  draft: resource.lifecycle.DraftMeta,
  stateName: resource.lifecycle.StateName,
) {
  const resData: ResourceDataType = {
    title: draft.title,
    description: draft.description,
    learningOutcomes: draft.learningOutcomes,
    content: fromContent(draft.content),
    image: toImage(draft.image),
    language: draft.language ?? '',
    level: draft.level ?? '',
    license: draft.license ?? '',
    month: draft.month ?? '',
    subject: draft.subject ?? '',
    type: draft.type ?? '',
    year: draft.year ?? '',
    published: stateName === 'Published',
    lifecycleState: stateName,
  }

  return resData
}

function fromContent(
  draftContent: resource.lifecycle.DraftMeta['content'],
): ResourceDataType['content'] {
  if (draftContent.kind === 'file') {
    return { kind: 'file', fsItem: draftContent.content.fsItem }
  } else {
    return { kind: 'link', url: draftContent.url }
  }
}

function toImage(
  draftImage: resource.lifecycle.DraftMeta['image'],
): ResourceDataType['image'] | null {
  if (!draftImage) {
    return null
  }
  if (draftImage.kind === 'file') {
    return {
      kind: 'file',
      directAccessId: draftImage.image.directAccessId,
      credits: draftImage.image.credits,
    }
  } else {
    return { kind: 'url', url: draftImage.url, credits: draftImage.credits }
  }
}
