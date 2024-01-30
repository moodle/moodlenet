import type { Document } from '@moodlenet/system-entities/server'
import { ActivityLogCollection, db } from '../init/arangodb.mjs'
import { digestActivityEvent } from '../srv/digestActivities/activity-events-handler.mjs'
import type { ActivityLogDataType } from '../types.mjs'

const TIMEOUT_WHEN_NO_MORE_SO_FAR = 500
type DigestActivitiesLoopHandle = { to: null | NodeJS.Timeout }
export const digestActivitiesLoopHandles = (function startAllDigestActivitiesLoops() {
  const loopHandle: DigestActivitiesLoopHandle = { to: null }
  nextDigestActivitiesBatch()
  return loopHandle
  async function nextDigestActivitiesBatch() {
    const noMoreSoFar = await digestOneActivities()
    const nextOneAfter = noMoreSoFar ? TIMEOUT_WHEN_NO_MORE_SO_FAR : 0
    loopHandle.to = setTimeout(nextDigestActivitiesBatch, nextOneAfter)

    async function digestOneActivities(): Promise<boolean> {
      const entityPointsToSyncCursor = await db.query<Document<ActivityLogDataType>>(
        `
          FOR activity IN @@ActivityLogCollection
            FILTER !activity.digested
            SORT activity.ulid
            LIMIT 1
            RETURN activity
        `,
        {
          '@ActivityLogCollection': ActivityLogCollection.name,
        },
      )
      const activityToDigest = await entityPointsToSyncCursor.next()

      if (!activityToDigest) {
        return true
      }

      console.log(`digesting activity ${activityToDigest.event}\n`)
      await Promise.all([
        digestActivityEvent(activityToDigest),
        ActivityLogCollection.update(activityToDigest._id, { digested: true }, { silent: true }),
      ])

      return false
    }
  }
})()
