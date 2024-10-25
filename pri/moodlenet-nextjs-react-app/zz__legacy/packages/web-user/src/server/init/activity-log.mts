import * as collection from '@moodlenet/collection/server'
import type { EventPayload } from '@moodlenet/core'
import * as crypto from '@moodlenet/crypto/server'
import * as resource from '@moodlenet/ed-resource/server'
import { shell } from '../shell.mjs'
import type { ActivityLogDataType, WebUserActivityEvents } from '../types.mjs'

import { ActivityLogCollection } from '../init/arangodb.mjs'
import { digestActivityEvent } from '../srv/digestActivities/activity-events-handler.mjs'

// console.log('init /*/')

resource.on('downloaded', ({ data }) => {
  const { resourceKey, userId } = data
  if (!userId) {
    return
  }
  data.userId && shell.events.emit('resource-downloaded', { resourceKey, userId })
})
resource.on('created', ({ data }) => shell.events.emit('resource-created', data))
resource.on('deleted', ({ data }) => shell.events.emit('resource-deleted', data))
resource.on('published', ({ data }) => shell.events.emit('resource-published', data))
resource.on('request-metadata-generation', ({ data }) =>
  shell.events.emit('resource-request-metadata-generation', data),
)
resource.on('unpublished', ({ data }) => shell.events.emit('resource-unpublished', data))
resource.on('updated-meta', ({ data }) => shell.events.emit('resource-updated-meta', data))

collection.on('created', ({ data }) => shell.events.emit('collection-created', data))
collection.on('deleted', ({ data }) => shell.events.emit('collection-deleted', data))
collection.on('published', ({ data }) => shell.events.emit('collection-published', data))
collection.on('resource-list-curation', ({ data }) =>
  shell.events.emit('collection-resource-list-curation', data),
)
collection.on('unpublished', ({ data }) => shell.events.emit('collection-unpublished', data))
collection.on('updated-meta', ({ data }) => shell.events.emit('collection-updated-meta', data))

shell.events.any(saveWebUserActivity)

export function saveWebUserActivity(activity: EventPayload<WebUserActivityEvents>) {
  const { ulid } = crypto.ulid.create({ now: activity.at })
  const activityData: ActivityLogDataType = {
    ulid,
    digested: false,
    ...activity,
  }
  ActivityLogCollection.save(activityData, {
    silent: true,
    returnNew: false,
    waitForSync: false,
    overwriteMode: 'ignore',
  })
  digestActivityEvent(activityData)
}
