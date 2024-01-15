import type { CollectionDataType } from '@moodlenet/collection/server'
import { getCollectionMeta } from '@moodlenet/collection/server'
import type { EventPayload } from '@moodlenet/core'
import '@moodlenet/ed-resource/server'
import type { EntityIdentifier } from '@moodlenet/system-entities/common'
import type { EntityFullDocument } from '@moodlenet/system-entities/server'
import type { ProfileDataType, WebUserActivityEvents } from '../../../../exports.mjs'
import { shell } from '../../../../shell.mjs'
import { initialEventsNowISO } from './initialEventsNow.mjs'

export default function collectionActivityEvents(
  profile: EntityFullDocument<ProfileDataType>,
  ownCollections: EntityFullDocument<CollectionDataType>[],
) {
  const userActivities: EventPayload<WebUserActivityEvents>[] = []

  const pkgId = shell.myId
  const userId: EntityIdentifier = { _key: profile._key, entityClass: profile._meta.entityClass }
  for (const ownCollection of ownCollections) {
    const collectionKey = ownCollection._key
    const collectionCreatedAtDate = new Date(ownCollection._meta.created)
    const collectionUpdatedAtDate = new Date(ownCollection._meta.updated)
    // collection-activity-event
    userActivities.push({
      event: 'collection-created',
      pkgId,
      at: collectionCreatedAtDate.toISOString(),
      data: {
        collectionKey,
        userId,
      },
    })

    if (
      Math.floor(collectionCreatedAtDate.getTime() / 10000) !==
      Math.floor(collectionUpdatedAtDate.getTime() / 10000)
    ) {
      userActivities.push({
        event: 'collection-updated',
        pkgId,
        at: collectionUpdatedAtDate.toISOString(),
        data: {
          collectionKey,
          userId,
          updatedMeta: getCollectionMeta(ownCollection),
        },
      })
    }

    if (ownCollection.published) {
      userActivities.push({
        event: 'collection-published',
        pkgId,
        at: initialEventsNowISO,
        data: {
          collectionKey,
          userId,
        },
      })
    }

    ownCollection.resourceList.forEach(resourceItem => {
      userActivities.push({
        event: 'collection-resource-list-curation',
        pkgId,
        at: initialEventsNowISO,
        data: {
          collectionKey,
          userId,
          action: 'add',
          resourceKey: resourceItem._key,
        },
      })
    })
  }
  return userActivities
}
