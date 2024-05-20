import type { EventPayload } from '@moodlenet/core'
import { type WebUserActivityEvents } from '../../exports.mjs'
import { WebUserCollection } from '../../init/arangodb.mjs'
import {
  maintainProfilePublishedContributionCount,
  removeFeaturedFromAllUsers,
  removeResourceFromAllCollections,
  upsertDeltaPoints,
} from './lib.aql.io.mjs'
import * as PCFG from './points-configs.mjs'

export async function digestActivityEvent(activity: EventPayload<WebUserActivityEvents>) {
  switch (activity.event) {
    case 'resource-deleted': {
      const { resource } = activity.data
      await Promise.all([
        removeFeaturedFromAllUsers({ featuredEntityId: resource._id }),
        removeResourceFromAllCollections({ resourceKey: resource._key }),
      ])
      break
    }
    case 'collection-deleted': {
      const { collection } = activity.data
      await removeFeaturedFromAllUsers({ featuredEntityId: collection._id })
      break
    }
    case 'feature-entity': {
      await upsertDeltaPoints(PCFG.featuredActivity(activity.data))
      break
    }
    case 'collection-created': {
      break
    }
    case 'collection-published': {
      await upsertDeltaPoints(PCFG.switchCollectionPublishing(activity.data, true))
      await maintainProfilePublishedContributionCount(activity)
      break
    }
    case 'collection-unpublished': {
      await upsertDeltaPoints(PCFG.switchCollectionPublishing(activity.data, false))
      await maintainProfilePublishedContributionCount(activity)
      break
    }
    case 'collection-resource-list-curation': {
      await upsertDeltaPoints(PCFG.collectionResourceListCuration(activity.data))
      break
    }

    case 'collection-updated-meta': {
      break
    }
    case 'created-web-user-account': {
      await upsertDeltaPoints(PCFG.createdProfileDeltaPoints(activity.data))
      break
    }
    case 'deleted-web-user-account': {
      break
    }
    case 'edit-profile-interests': {
      await upsertDeltaPoints(PCFG.profileInterestsFirstSet(activity.data))
      break
    }
    case 'edit-profile-meta': {
      await upsertDeltaPoints(PCFG.editProfileMeta(activity.data))
      break
    }
    case 'request-send-message-to-web-user': {
      break
    }
    case 'resource-created': {
      break
    }
    case 'resource-downloaded': {
      break
    }
    case 'resource-unpublished': {
      await upsertDeltaPoints(PCFG.switchResourcePublishing(activity.data, false))
      await maintainProfilePublishedContributionCount(activity)
      break
    }
    case 'resource-published': {
      await upsertDeltaPoints(PCFG.switchResourcePublishing(activity.data, true))
      await maintainProfilePublishedContributionCount(activity)
      break
    }
    case 'resource-request-metadata-generation': {
      break
    }

    case 'user-publishing-permission-change': {
      await upsertDeltaPoints(PCFG.switchUserPublishingPermission(activity.data))
      break
    }
    case 'resource-updated-meta': {
      break
    }
    case 'web-user-logged-in': {
      WebUserCollection.update(
        { _key: activity.data.webUserKey },
        { lastVisit: { at: activity.at } },
      )
      break
    }
    case 'web-user-delete-account-intent':
      break
    case 'web-user-reported': {
      break
    }
  }
}
