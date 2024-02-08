import { setPkgCurrentUser } from '@moodlenet/system-entities/server'
import { shell } from '../../../shell.mjs'
import { Profile } from '../../sys-entities.mjs'

await shell.initiateCall(async () => {
  await setPkgCurrentUser()

  await Profile.collection
    .indexes()
    .then(indexes =>
      Promise.all(
        indexes
          .filter(({ name }) => name === 'knownFeaturedEntities')
          .map(index => Profile.collection.dropIndex(index)),
      ),
    )
  await Profile.collection.ensureIndex({
    type: 'persistent',
    name: 'knownFeaturedEntities_entityType',
    fields: ['knownFeaturedEntities[*].entityType'],
  })
  await Profile.collection.ensureIndex({
    type: 'persistent',
    name: 'knownFeaturedEntities_at',
    fields: ['knownFeaturedEntities[*].at'],
  })
  await Profile.collection.ensureIndex({
    type: 'persistent',
    name: 'knownFeaturedEntities_key',
    fields: ['knownFeaturedEntities[*]._key'],
  })
  // await Profile.collection.ensureIndex({
  //   type: 'persistent',
  //   name: 'knownFeaturedEntities_id',
  //   fields: ['knownFeaturedEntities[*]._id'],
  // })
  await Profile.collection.ensureIndex({
    type: 'persistent',
    name: 'knownFeaturedEntities_feature',
    fields: ['knownFeaturedEntities[*].feature'],
  })
  // await Profile.collection.ensureIndex({
  //   type: 'persistent',
  //   name: 'knownFeaturedEntities_feature_key_type',
  //   fields: [
  //     'knownFeaturedEntities[*].feature',
  //     'knownFeaturedEntities[*]._key',
  //     'knownFeaturedEntities[*].entityType',
  //   ],
  //   unique: true,
  // })
  //
  await Profile.collection.ensureIndex({
    type: 'persistent',
    name: 'created',
    fields: ['_meta.created'],
  })
  await Profile.collection.ensureIndex({
    type: 'persistent',
    name: 'updated',
    fields: ['_meta.updated'],
  })
  await Profile.collection.ensureIndex({
    type: 'persistent',
    name: 'points',
    fields: ['points'],
  })
})

export default 5
