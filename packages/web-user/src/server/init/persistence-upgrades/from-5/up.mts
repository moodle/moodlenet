import { setPkgCurrentUser } from '@moodlenet/system-entities/server'
import { shell } from '../../../shell.mjs'
import { WebUserCollection, db } from '../../arangodb.mjs'

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

  // const emptyModerationField: WebUserDataType['moderation'] = {
  //   ignoredReports: { items: [] },
  //   reports: { amount: 0, items: [], lastItem: null, mainReasonName: null },
  //   status: { history: [] },
  // }
  const curs = await db.query({
    query: `
FOR user IN @@WebUserCollectionName
UPDATE user WITH {
  moderation: {
    ignoredReports: { items: [] },
    reports: { amount: 0, items: [], lastItem: null, mainReasonName: null },
    status: { history: [] },
  }
} IN @@WebUserCollectionName
RETURN null
`,
    bindVars: {
      '@WebUserCollectionName': WebUserCollection.name,
      //   emptyModerationField,
    },
  })
  await curs.all()
  await curs.kill()
})

export default 6
