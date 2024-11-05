import type { CollectionDataType } from '@moodlenet/collection/server'
import { getCollectionMeta } from '@moodlenet/collection/server'

import type { EventPayload } from '@moodlenet/core'
import '@moodlenet/ed-resource/server'
import { Resource } from '@moodlenet/ed-resource/server'
import type { EntityIdentifier } from '@moodlenet/system-entities/common'
import type { EntityFullDocument } from '@moodlenet/system-entities/server'
import type { ProfileDataType, WebUserActivityEvents } from '../../../../exports.mjs'
import { shell } from '../../../../shell.mjs'
import { initialEventsNowISO } from './initialEventsNow.mjs'

export default async function collectionActivityEvents(
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
        collection: ownCollection,
        userId,
      },
    })

    if (
      Math.floor(collectionCreatedAtDate.getTime() / 10000) !==
      Math.floor(collectionUpdatedAtDate.getTime() / 10000)
    ) {
      userActivities.push({
        event: 'collection-updated-meta',
        pkgId,
        at: collectionUpdatedAtDate.toISOString(),
        data: {
          collectionKey,
          userId,
          meta: getCollectionMeta(ownCollection),
          oldMeta: getCollectionMeta(ownCollection),
        },
      })
    }

    if (ownCollection.published) {
      userActivities.push({
        event: 'collection-published',
        pkgId,
        at: initialEventsNowISO,
        data: {
          collection: ownCollection,
          userId,
          // resourceListInfo: await getExistingResourcesInCollectionInfo(
          //   ownCollection._meta.creatorEntityId,
          //   ownCollection.resourceList,
          // ),
        },
      })
    }

    ownCollection.resourceList.forEach(async (resourceItem, index) => {
      const resource = await Resource.collection.document(
        { _key: resourceItem._key },
        { graceful: true },
      )
      if (!resource) {
        return
      }
      userActivities.push({
        event: 'collection-resource-list-curation',
        pkgId,
        at: initialEventsNowISO,
        data: {
          collection: {
            ...ownCollection,
            resourceList: ownCollection.resourceList.slice(0, index),
          },
          userId,
          action: 'add',
          resource,
        },
      })
    })
  }
  return userActivities
}
