import { send } from '@moodlenet/email-service/server'
import { getOrgData } from '@moodlenet/organization/server'
import { getWebappUrl } from '@moodlenet/react-app/server'
import { setPkgCurrentUser } from '@moodlenet/system-entities/server'
import { inactivityDeletionNotificationEmail } from '../../common/emails/Access/DeleteAccountEmail/InactivityDeletionNotification.js'
import { loginPageRoutePath } from '../../common/webapp-routes.mjs'
import { env } from '../env.mjs'
import { WebUserCollection, db } from '../init/arangodb.mjs'
import { shell } from '../shell.mjs'
import { deleteWebUserAccountNow } from '../srv/delete-account.mjs'
import type { WebUserRecord } from '../types.mjs'

const DAY_MS = env.deleteInactiveUsers === false ? NaN : env.deleteInactiveUsers.dayMs
const TIMEOUT_WHEN_NO_MORE_SO_FAR_MS = 0.5 * DAY_MS
const BATCH_SIZE = 1
if (env.deleteInactiveUsers) {
  start()
}
function start() {
  const inactivityConfig = env.deleteInactiveUsers
  if (!inactivityConfig) {
    return
  }
  const { afterNoVisitsForDays, notifyBeforeDays } = inactivityConfig
  const afterNoLogInForMs = afterNoVisitsForDays * DAY_MS
  const notifyBeforeMs = notifyBeforeDays * DAY_MS
  startInactivityNotifications()
  startInactiveUsersDeletions()
  async function queryUsersFor(scope: 'notification' | 'deletion') {
    const lastVisitBeforeDateMs_delete =
      Date.now() - afterNoLogInForMs - TIMEOUT_WHEN_NO_MORE_SO_FAR_MS
    const lastVisitBeforeDateMs_notify = lastVisitBeforeDateMs_delete - notifyBeforeMs

    const lastVisitBeforeDateMs =
      scope === 'deletion' ? lastVisitBeforeDateMs_delete : lastVisitBeforeDateMs_notify

    const query = `
    LET isDeletionScope = @scope == 'deletion'
    FOR webUser IN @@webUserCollection
      FILTER  !webUser.deleted && !webUser.deleting
              && webUser.lastVisit.at < @lastVisitBeforeDate
            //&& ${scope === 'deletion' ? '' : '!'}webUser.lastVisit.inactiveNotificationSentAt
              && (isDeletionScope 
                  ? true 
                  : !webUser.lastVisit.inactiveNotificationSentAt
                )
              && (isDeletionScope 
                  ? DATE_DIFF(  webUser.lastVisit.inactiveNotificationSentAt, DATE_NOW(), "milliseconds" ) >= @notifyBeforeMs
                  : true
                )
              

      SORT webUser.lastVisit.at
      LIMIT ${BATCH_SIZE}
      RETURN webUser
      `
    const bindVars = {
      '@webUserCollection': WebUserCollection.name,
      'lastVisitBeforeDate': new Date(lastVisitBeforeDateMs).toISOString(),
      'notifyBeforeMs': notifyBeforeMs,
      'scope': scope,
    }
    const cursor = await db.query<WebUserRecord>(query, bindVars)
    const result = await cursor.all()
    // console.log(
    //   { afterNoLogInForMs, notifyBeforeMs },
    //   [
    //     `queryUsersFor ${scope}`,
    //     //query,
    //     //JSON.stringify(bindVars, null, 2),
    //     'results:',
    //     result.length,
    //     //JSON.stringify(result, null, 2),
    //     '\n',
    //   ].join(`\n`),
    // )
    return result
  }

  async function startInactivityNotifications() {
    const records = await queryUsersFor('notification')

    const orgData = await getOrgData()

    await shell.initiateCall(async () => {
      await setPkgCurrentUser()
      return Promise.allSettled(
        records.map(async ({ displayName, _id, contacts: { email } }) => {
          if (!email) {
            return
          }
          await send(
            inactivityDeletionNotificationEmail({
              displayName,
              daysBeforeDeletion: notifyBeforeDays,
              instanceName: orgData.data.instanceName,
              loginUrl: getWebappUrl(loginPageRoutePath()),
              receiverEmail: email,
            }),
          )
          await WebUserCollection.update(_id, {
            lastVisit: { inactiveNotificationSentAt: new Date().toISOString() },
          })
        }),
      )
    })
    setTimeout(
      startInactivityNotifications,
      records.length === BATCH_SIZE ? 0 : TIMEOUT_WHEN_NO_MORE_SO_FAR_MS,
    )
  }

  async function startInactiveUsersDeletions() {
    const records = await queryUsersFor('deletion')

    await shell.initiateCall(async () => {
      await setPkgCurrentUser()
      const userDeletionResults = await Promise.allSettled(
        records.map(({ _key }) => deleteWebUserAccountNow(_key, { deletionReason: 'inactivity' })),
      )
      //console.log('userDeletionResults', JSON.stringify(userDeletionResults, null, 2))
      return userDeletionResults
    })
    setTimeout(
      startInactiveUsersDeletions,
      records.length === BATCH_SIZE ? 0 : TIMEOUT_WHEN_NO_MORE_SO_FAR_MS,
    )
  }
}
