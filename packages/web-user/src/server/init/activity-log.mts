import * as collection from '@moodlenet/collection/server'
import type { EventPayload } from '@moodlenet/core'
import * as resource from '@moodlenet/ed-resource/server'
import { shell } from '../shell.mjs'
import type { WebUserActivityEvents } from '../types.mjs'

import * as crypto from '@moodlenet/crypto/server'
import { ActivityLogCollection } from '../init/arangodb.mjs'

console.log('init /*/')

resource.on('created', payload => emit({ payload, entityType: 'resource' }))
resource.on('updated', payload => emit({ payload, entityType: 'resource' }))
resource.on('published', payload => emit({ payload, entityType: 'resource' }))
resource.on('unpublished', payload => emit({ payload, entityType: 'resource' }))
resource.on('deleted', payload => emit({ payload, entityType: 'resource' }))

collection.on('created', payload => emit({ payload, entityType: 'collection' }))
collection.on('updated', payload => emit({ payload, entityType: 'collection' }))
collection.on('published', payload => emit({ payload, entityType: 'collection' }))
collection.on('unpublished', payload => emit({ payload, entityType: 'collection' }))
collection.on('deleted', payload => emit({ payload, entityType: 'collection' }))
collection.on('resource-list-curation', payload => emit({ payload, entityType: 'collection' }))

function emit(entityCuration: WebUserActivityEvents['entity-curation-event']) {
  console.log('emitting entity-curation-event /*/')
  shell.events.emit('entity-curation-event', entityCuration)
}

shell.events.on('entity-curation-event', saveWebUserActivity)
shell.events.on('feature-entity', saveWebUserActivity)

async function saveWebUserActivity(activity: EventPayload<WebUserActivityEvents>) {
  console.log(`saveWebUserActivity [${activity.event}] /*/`)
  const { ulid, now } = crypto.ulid.create()
  const at = now.toISOString()
  return ActivityLogCollection.save({ activity, at, ulid })
}
