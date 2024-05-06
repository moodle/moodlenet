import { setPkgCurrentUser } from '@moodlenet/system-entities/server'
import { shell } from '../../../shell.mjs'
import type { WebUserDataType, WebUserRecord } from '../../../types.mjs'
import { ActivityLogCollection, WebUserCollection, db } from '../../arangodb.mjs'
import { Profile } from '../../sys-entities.mjs'

await shell.initiateCall(async () => {
  await setPkgCurrentUser()

  await WebUserCollection.ensureIndex({
    type: 'persistent',
    name: 'moderation_reports_amount',
    fields: ['moderation.reports.amount'],
  })
  await WebUserCollection.ensureIndex({
    type: 'persistent',
    name: 'moderation_reports_main_reason_name',
    fields: ['moderation.reports.mainReasonName'],
  })
  await WebUserCollection.ensureIndex({
    type: 'persistent',
    name: 'moderation_reports_last_date',
    fields: ['moderation.reports.lastItem.date'],
  })
  const allWebUsersCurs = await db.query<WebUserRecord>(
    {
      query: `FOR user IN @@WebUserCollectionName RETURN user`,
      bindVars: { '@WebUserCollectionName': WebUserCollection.name },
    },
    { batchSize: 5000, ttl: 60 * 60 * 1000, count: true },
  )
  let webUsersBatch: WebUserRecord[] | undefined
  let count = 0
  while ((webUsersBatch = await allWebUsersCurs.batches.next())) {
    count += webUsersBatch.length
    console.log('Migrating web users', count, 'of', allWebUsersCurs.count)
    await Promise.all(webUsersBatch.map(migrateWebUser))
  }
  await db.query({
    query: `
FOR a in @@ActivityCollectionName
FILTER a.event == 'user-publishing-permission-change'
        &&  a.data.moderator.type == 'pkg'
REMOVE a IN @@ActivityCollectionName
RETURN null
  `,
    bindVars: {
      '@ActivityCollectionName': ActivityLogCollection.name,
    },
  })
})

export default 6

async function migrateWebUser(webUser: WebUserRecord) {
  const profile = await Profile.collection.document(webUser.profileKey)
  if (!profile) return
  const emptyModerationField: WebUserDataType['moderation'] = {
    reports: { amount: 0, items: [], mainReasonName: null },
    status: { history: [] },
  }
  const curs = await db.query({
    query: `
UPDATE @webUser WITH { publisher:@publisher,  moderation: @emptyModerationField } IN @@WebUserCollectionName
RETURN null`,
    bindVars: {
      '@WebUserCollectionName': WebUserCollection.name,
      webUser,
      emptyModerationField,
      'publisher': profile.publisher,
    },
  })
  await curs.all()
  await curs.kill()
}
