import type { EventPayload } from '@moodlenet/core'
import type { ReportItem, WebUserActivityEvents } from '../../exports.mjs'
import { WebUserCollection, db } from '../../init/arangodb.mjs'
import {
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
      break
    }
    case 'collection-unpublished': {
      await upsertDeltaPoints(PCFG.switchCollectionPublishing(activity.data, false))
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
      break
    }
    case 'resource-published': {
      await upsertDeltaPoints(PCFG.switchResourcePublishing(activity.data, true))
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
      break
    }
    case 'web-user-report': {
      const {
        at,
        data: { comment, reportOptionTypeId, reporterUser, targetUser },
      } = activity

      const report: ReportItem = {
        comment,
        date: at,
        ignored: null,
        reporterWebUserKey: reporterUser.webUserKey,
        reportTypeId: reportOptionTypeId,
        status: targetUser.status,
      }
      const webUserId = WebUserCollection.documentId({ _key: targetUser.webUserKey })
      const curs = await db.query({
        query: `
LET user = DOCUMENT(@webUserId)
LET newReportHistory = UNSHIFT(user.moderation.reportHistory || [], @report)
UPDATE user WITH {
  moderation: {
    reportHistory: newReportHistory
  }
} IN @@WebUserCollectionName
RETURN user ? true : false
`,
        bindVars: {
          '@WebUserCollectionName': WebUserCollection.name,
          webUserId,
          report,
        },
      })
      await curs.all()
      await curs.kill()
    }
  }
}
