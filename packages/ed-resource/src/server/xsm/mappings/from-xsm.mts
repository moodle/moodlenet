import type { MetaEdits, ResourceMeta, StateName } from '@moodlenet/core-domain/resource'
import type { ResourceDataType } from '../../types.mjs'

export function metaEdits2ResourceDataMetaEdits(
  edits: MetaEdits | null | undefined,
): Partial<Omit<ResourceDataType, 'image' | 'content'>> {
  if (!edits) {
    return {}
  }
  const partialResourceData: Partial<ResourceDataType> = {
    title: edits.title,
    description: edits.description,
    learningOutcomes: edits.learningOutcomes && edits.learningOutcomes.map(({ value }) => value),
    language: edits.language?.code,
    level: edits.level?.code,
    license: edits.license?.code,
    subject: edits.subject?.code,
    type: edits.type?.code,
    ...(edits.originalPublicationInfo
      ? {
          year: String(edits.originalPublicationInfo.year),
          month: String(edits.originalPublicationInfo?.month),
        }
      : {}),
  }
  return partialResourceData
}
export function stateMeta2ResourceData(meta: ResourceMeta, stateName: StateName) {
  const resourceData: ResourceDataType = {
    title: meta.title,
    description: meta.description,
    learningOutcomes: meta.learningOutcomes.map(({ value }) => value),
    content: meta.references.content.ref,
    image: meta.references.image?.ref ?? null,
    language: meta.language?.code ?? '',
    level: meta.level?.code ?? '',
    license: meta.license?.code ?? '',
    subject: meta.subject?.code ?? '',
    type: meta.type?.code ?? '',
    ...(meta.originalPublicationInfo
      ? {
          year: String(meta.originalPublicationInfo.year),
          month: String(meta.originalPublicationInfo.month),
        }
      : { year: '', month: '' }),
    published: stateName === 'Published',
    lifecycleState: stateName,
  }

  return resourceData
}
