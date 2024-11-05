import { Collection } from '../../sys-entities.mjs'

await Promise.all(
  Object.entries({
    creatorEntityId: ['_meta.creatorEntityId'],
    entityIdentifier: ['_meta.creator.entityIdentifier'],
    published: ['published'],
  }).map(([name, fields]) =>
    Collection.collection.ensureIndex({
      type: 'persistent',
      fields,
      name,
    }),
  ),
)

export default 2
