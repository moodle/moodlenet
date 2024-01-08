import * as collection from '@moodlenet/collection/server'
import type { EventPayload } from '@moodlenet/core'
import * as resource from '@moodlenet/ed-resource/server'
import { shell } from '../shell.mjs'
import type { WebUserActivityEvents } from '../types.mjs'

import * as crypto from '@moodlenet/crypto/server'
import { ActivityLogCollection } from '../init/arangodb.mjs'

// console.log('init /*/')

resource.onAny(payload => emitECE({ payload, entityType: 'resource' }))
collection.onAny(payload => emitECE({ payload, entityType: 'collection' }))

function emitECE(entityCuration: WebUserActivityEvents['entity-activity-event']) {
  // console.log('emitting entity-activity-event /*/')
  shell.events.emit('entity-activity-event', entityCuration)
}

shell.events.any(saveWebUserActivity)

async function saveWebUserActivity(activity: EventPayload<WebUserActivityEvents>) {
  // console.log(`saveWebUserActivity [${activity.event}] /*/`)
  const { ulid, now } = crypto.ulid.create()
  const at = now.toISOString()
  return ActivityLogCollection.save({ activity, at, ulid })
}
