import { setPkgCurrentUser } from '@moodlenet/system-entities/server'
import { shell } from '../../../shell.mjs'
import { Resource } from '../../sys-entities.mjs'

await shell.initiateCall(async () => {
  await setPkgCurrentUser()

  await Resource.collection
    .indexes()
    .then(indexes =>
      Promise.all(
        indexes
          .filter(({ name }) => name === 'entityIdentifier')
          .map(index => Resource.collection.dropIndex(index)),
      ),
    )
  await Resource.collection.ensureIndex({
    type: 'persistent',
    name: 'creatorKey',
    fields: ['_meta.creator.entityIdentifier._key'],
  })
  await Resource.collection.ensureIndex({
    type: 'persistent',
    name: 'created',
    fields: ['_meta.created'],
  })
  await Resource.collection.ensureIndex({
    type: 'persistent',
    name: 'updated',
    fields: ['_meta.updated'],
  })
  await Resource.collection.ensureIndex({
    type: 'persistent',
    name: 'popularity',
    fields: ['popularity.overall'],
  })
  await Resource.collection.ensureIndex({
    type: 'persistent',
    name: 'learningOutcomesSentences',
    fields: ['learningOutcomes[*].sentence'],
  })
  await Resource.collection.ensureIndex({
    type: 'persistent',
    name: 'state',
    fields: ['persistentContext.state'],
  })
  await Resource.collection.ensureIndex({
    type: 'persistent',
    name: 'language',
    fields: ['language'],
  })
  await Resource.collection.ensureIndex({
    type: 'persistent',
    name: 'level',
    fields: ['level'],
  })
  await Resource.collection.ensureIndex({
    type: 'persistent',
    name: 'license',
    fields: ['license'],
  })
  await Resource.collection.ensureIndex({
    type: 'persistent',
    name: 'subject',
    fields: ['subject'],
  })
  await Resource.collection.ensureIndex({
    type: 'persistent',
    name: 'type',
    fields: ['type'],
  })
})

export default 5
