import type { EventPayload } from '@moodlenet/core'
import type { ResourceDataType } from '@moodlenet/ed-resource/server'
import { getEventResourceMeta, map as resourceMapping } from '@moodlenet/ed-resource/server'
import type { EntityIdentifier } from '@moodlenet/system-entities/common'
import type { EntityFullDocument } from '@moodlenet/system-entities/server'
import type { ProfileDataType, WebUserActivityEvents } from '../../../../exports.mjs'
import { shell } from '../../../../shell.mjs'
import { initialEventsNowISO } from './initialEventsNow.mjs'

export default function resourceActivityEvents(
  profile: EntityFullDocument<ProfileDataType>,
  ownResources: EntityFullDocument<ResourceDataType>[],
) {
  const userActivities: EventPayload<WebUserActivityEvents>[] = []

  const pkgId = shell.myId
  const userId: EntityIdentifier = { _key: profile._key, entityClass: profile._meta.entityClass }
  for (const ownResource of ownResources) {
    const resourceKey = ownResource._key

    const resourceCreatedAtDate = new Date(ownResource._meta.created)
    const resourceUpdatedAtDate = new Date(ownResource._meta.updated)
    // resource-activity-event
    userActivities.push({
      event: 'resource-created',
      pkgId,
      at: resourceCreatedAtDate.toISOString(),
      data: {
        resource: ownResource,
        userId,
      },
    })

    if (
      Math.floor(resourceCreatedAtDate.getTime() / 10000) !==
      Math.floor(resourceUpdatedAtDate.getTime() / 10000)
    ) {
      userActivities.push({
        event: 'resource-updated-meta',
        pkgId,
        at: resourceUpdatedAtDate.toISOString(),
        data: {
          resourceKey,
          userId,
          meta: getEventResourceMeta(resourceMapping.db.doc_2_persistentContext(ownResource).doc),
          oldMeta: getEventResourceMeta(
            resourceMapping.db.doc_2_persistentContext(ownResource).doc,
          ),
        },
      })
    }

    if (ownResource.published) {
      userActivities.push({
        event: 'resource-published',
        pkgId,
        at: initialEventsNowISO,
        data: {
          resource: ownResource,
          userId,
        },
      })
    }

    // let downloadTimes = ownResource.popularity?.items.downloads?.value ?? 0
    // while (downloadTimes--) {
    //   userActivities.push({
    //     event: 'resource-downloaded',
    //     pkgId,
    //     at: initialNowISO,
    //     data: {
    //       resourceKey,
    //       userId: null,
    //     },
    //   })
    // }
  }
  return userActivities
}
