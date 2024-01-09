import * as collection from '@moodlenet/collection/server'
import type { EventPayload } from '@moodlenet/core'
import * as resource from '@moodlenet/ed-resource/server'
import { shell } from '../shell.mjs'
import type { WebUserActivityEvents } from '../types.mjs'

import * as crypto from '@moodlenet/crypto/server'
import { ActivityLogCollection } from '../init/arangodb.mjs'

// console.log('init /*/')

resource.onAny(payload => {
  const { data, event } = payload
  shell.events.emit('resource-activity-event', { data, event })
})
collection.onAny(payload => {
  const { data, event } = payload
  shell.events.emit('collection-activity-event', { data, event })
})

shell.events.any(saveWebUserActivity)

async function saveWebUserActivity(activity: EventPayload<WebUserActivityEvents>) {
  // console.log(`saveWebUserActivity [${activity.event}] /*/`)
  const { ulid, now } = crypto.ulid.create()
  const at = now.toISOString()
  const { data, event } = activity
  return ActivityLogCollection.save({ data, event, at, ulid })
}
