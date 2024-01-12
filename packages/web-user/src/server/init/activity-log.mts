import * as collection from '@moodlenet/collection/server'
import type { EventPayload } from '@moodlenet/core'
import * as resource from '@moodlenet/ed-resource/server'
import { shell } from '../shell.mjs'
import type { WebUserActivityEvents } from '../types.mjs'

import * as crypto from '@moodlenet/crypto/server'
import { ActivityLogCollection } from '../init/arangodb.mjs'

// console.log('init /*/')

resource.on('created', ({ data }) => shell.events.emit('resource-created', data))
resource.on('deleted', ({ data }) => shell.events.emit('resource-deleted', data))
resource.on('downloaded', ({ data }) => shell.events.emit('resource-downloaded', data))
resource.on('published', ({ data }) => shell.events.emit('resource-published', data))
resource.on('request-metadata-generation', ({ data }) =>
  shell.events.emit('resource-request-metadata-generation', data),
)
resource.on('unpublished', ({ data }) => shell.events.emit('resource-unpublished', data))
resource.on('updated', ({ data }) => shell.events.emit('resource-updated', data))

collection.on('created', ({ data }) => shell.events.emit('collection-created', data))
collection.on('deleted', ({ data }) => shell.events.emit('collection-deleted', data))
collection.on('published', ({ data }) => shell.events.emit('collection-published', data))
collection.on('resource-list-curation', ({ data }) =>
  shell.events.emit('collection-resource-list-curation', data),
)
collection.on('unpublished', ({ data }) => shell.events.emit('collection-unpublished', data))
collection.on('updated', ({ data }) => shell.events.emit('collection-updated', data))

shell.events.any(saveWebUserActivity)

export async function saveWebUserActivity(activity: EventPayload<WebUserActivityEvents>) {
  return saveWebUserActivities([activity])
}
export async function saveWebUserActivities(activities: EventPayload<WebUserActivityEvents>[]) {
  return ActivityLogCollection.saveAll(
    activities.map(activity => {
      const { ulid } = crypto.ulid.create()
      return {
        ulid,
        ...activity,
      }
    }),
    { silent: true, returnNew: false, waitForSync: false, overwriteMode: 'ignore' },
  )
}
