import type { ResourceMeta, StateName } from '@moodlenet/core-domain/resource'
import type { ResourceDataType } from '../../types.mjs'

export function resourceData(meta: ResourceMeta, stateName: StateName) {
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

    year: String(meta.originalPublicationInfo?.year ?? ''),
    month: String(meta.originalPublicationInfo?.month ?? ''),
    published: stateName === 'Published',
    lifecycleState: stateName,
  }

  return resourceData
}
