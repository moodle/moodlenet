import { Profile } from '../../sys-entities.mjs'

await Promise.all(
  Object.entries({
    knownFeaturedEntities: ['knownFeaturedEntities'],
    publisher: ['publisher'],
  }).map(([name, fields]) =>
    Profile.collection.ensureIndex({
      type: 'persistent',
      fields,
      name,
    }),
  ),
)

export default 3
