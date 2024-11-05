import { Resource } from '../../sys-entities.mjs'

await Promise.all(
  Object.entries({
    creatorEntityId: ['_meta.creatorEntityId'],
    entityIdentifier: ['_meta.creator.entityIdentifier'],
    published: ['published'],
  }).map(([name, fields]) =>
    Resource.collection.ensureIndex({
      type: 'persistent',
      fields,
      name,
    }),
  ),
)

export default 3
