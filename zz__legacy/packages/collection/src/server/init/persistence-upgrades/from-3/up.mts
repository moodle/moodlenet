import { setPkgCurrentUser } from '@moodlenet/system-entities/server'
import { shell } from '../../../shell.mjs'
import { Collection } from '../../sys-entities.mjs'

await shell.initiateCall(async () => {
  await setPkgCurrentUser()

  await Collection.collection
    .indexes()
    .then(indexes =>
      Promise.all(
        indexes
          .filter(({ name }) => name === 'entityIdentifier')
          .map(index => Collection.collection.dropIndex(index)),
      ),
    )
  await Collection.collection.ensureIndex({
    type: 'persistent',
    name: 'creatorKey',
    fields: ['_meta.creator.entityIdentifier._key'],
  })
  await Collection.collection.ensureIndex({
    type: 'persistent',
    name: 'popularity',
    fields: ['popularity.overall'],
  })
  await Collection.collection.ensureIndex({
    type: 'persistent',
    name: 'resourceListKeys',
    fields: ['resourceList[*]._key'],
  })
  await Collection.collection.ensureIndex({
    type: 'persistent',
    name: 'created',
    fields: ['_meta.created'],
  })
  await Collection.collection.ensureIndex({
    type: 'persistent',
    name: 'updated',
    fields: ['_meta.updated'],
  })
})

export default 4
