import * as collection from '@moodlenet/collection/server'
import type { EventPayload } from '@moodlenet/core'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import type { WebUserActivityEvents } from '../exports.mjs'
import { Profile } from '../exports.mjs'
import { deltaPopularity } from './popularity.mjs'

export function digestActivityEvent(activity: EventPayload<WebUserActivityEvents>) {
  switch (activity.event) {
    case 'resource-deleted': {
      const { resource } = activity.data
      removeFeaturedFromAllUsers({ featuredEntityId: resource._id })
      removeResourceFromAllCollections({ resourceKey: resource._key })
      break
    }
    case 'collection-deleted': {
      const { collection } = activity.data
      removeFeaturedFromAllUsers({ featuredEntityId: collection._id })
      break
    }
    case 'user-publishing-permission-change': {
      activity.data.profile.knownFeaturedEntities.forEach(({ feature, entityType, _key }) => {
        const add = activity.data.type === 'given'
        deltaPopularity(add, {
          feature,
          entityType,
          entityKey: _key,
        })
      })
      break
    }
    case 'feature-entity': {
      const { action, item, profile /* , targetEntityDoc */ } = activity.data
      const add = action === 'add'
      if (profile.publisher) {
        deltaPopularity(add, {
          feature: item.feature,
          entityType: item.entityType,
          entityKey: item._key,
        })
      }
      break
    }
    case 'collection-created': {
      break
    }
    case 'collection-published': {
      break
    }
    case 'collection-resource-list-curation': {
      break
    }
    case 'collection-unpublished': {
      break
    }
    case 'collection-updated-meta': {
      break
    }
    case 'created-web-user-account': {
      break
    }
    case 'deleted-web-user-account': {
      break
    }
    case 'edit-profile-interests': {
      break
    }
    case 'edit-profile-meta': {
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
    case 'resource-published': {
      break
    }
    case 'resource-request-metadata-generation': {
      break
    }
    case 'resource-unpublished': {
      break
    }
    case 'resource-updated-meta': {
      break
    }
    case 'web-user-logged-in': {
      break
    }
  }
}

async function removeFeaturedFromAllUsers({ featuredEntityId }: { featuredEntityId: string }) {
  sysEntitiesDB.query(
    `
FOR profile IN \`${Profile.collection.name}\`
  FILTER @featuredEntityId IN profile.knownFeaturedEntities[*]._id
  LET filteredFeats = profile.knownFeaturedEntities[* FILTER CURRENT._id != @featuredEntityId] 
  UPDATE profile WITH { knownFeaturedEntities: filteredFeats } IN \`${Profile.collection.name}\`
`,
    { featuredEntityId },
    { retryOnConflict: 5 },
  )
}
async function removeResourceFromAllCollections({ resourceKey }: { resourceKey: string }) {
  return sysEntitiesDB.query(
    `
FOR collection IN \`${collection.Collection.collection.name}\`
  FILTER @resourceKey IN collection.resourceList[*]._key
  LET filteredResourceList = collection.resourceList[* FILTER CURRENT._key != @resourceKey] 
  UPDATE collection WITH { resourceList: filteredResourceList } IN \`${collection.Collection.collection.name}\`
`,
    { resourceKey },
    { retryOnConflict: 5 },
  )
}
