import { send } from '@moodlenet/email-service/server'
import { getOrgData } from '@moodlenet/organization/server'
import { getWebappUrl } from '@moodlenet/react-app/server'
import { setPkgCurrentUser, sysEntitiesDB } from '@moodlenet/system-entities/server'
import { inactivityDeletionNotificationEmail } from '../../common/emails/Access/DeleteAccountEmail/InactivityDeletionNotification.js'
import { LOGIN_PAGE_ROUTE_BASE_PATH } from '../../common/webapp-routes.mjs'
import { env } from '../env.mjs'
import { WebUserCollection } from '../init/arangodb.mjs'
import { shell } from '../shell.mjs'
import { deleteWebUserAccountNow } from '../srv/delete-account.mjs'
import type { WebUserRecord } from '../types.mjs'

const DAY_MS = 24 * 60 * 60 * 1000
const TIMEOUT_WHEN_NO_MORE_SO_FAR_MS = 0.5 * DAY_MS
const BATCH_SIZE = 100
start()
function start() {
  const inactivityConfig = env.deleteInactiveUsers
  if (!inactivityConfig) {
    return
  }
  const { afterNoLogInForDays, notifyBeforeDays } = inactivityConfig
  const afterNoLogInForMs = afterNoLogInForDays * DAY_MS
  const notifyBeforeMs = notifyBeforeDays * DAY_MS
  queryBatchForInactivityNotifications()
  queryBatchForInactiveUsersDeletions()
  async function queryBatchForInactivityNotifications() {
    const records = await queryUsersFor('notification')

    const orgData = await getOrgData()

    shell.initiateCall(async () => {
      await setPkgCurrentUser()
      return Promise.all(
        records.map(async ({ displayName, _id, contacts: { email } }) => {
          if (!email) {
            return
          }
          await send(
            inactivityDeletionNotificationEmail({
              displayName,
              daysBeforeDeletion: notifyBeforeDays,
              instanceName: orgData.data.instanceName,
              loginUrl: getWebappUrl(LOGIN_PAGE_ROUTE_BASE_PATH),
              receiverEmail: email,
            }),
          )
          await WebUserCollection.update(_id, {
            lastLogin: { inactiveNotificationSentAt: new Date().toISOString() },
          })
        }),
      )
    })
    setTimeout(
      queryBatchForInactivityNotifications,
      records.length === BATCH_SIZE ? 0 : TIMEOUT_WHEN_NO_MORE_SO_FAR_MS,
    )
  }
  async function queryBatchForInactiveUsersDeletions() {
    const records = await queryUsersFor('deletion')

    shell.initiateCall(async () => {
      await setPkgCurrentUser()
      return Promise.all(
        records.map(async ({ _key }) => {
          await deleteWebUserAccountNow(_key, { deletionReason: 'inactivity' })
        }),
      )
    })
    setTimeout(
      queryBatchForInactiveUsersDeletions,
      records.length === BATCH_SIZE ? 0 : TIMEOUT_WHEN_NO_MORE_SO_FAR_MS,
    )
  }

  async function queryUsersFor(scope: 'notification' | 'deletion') {
    const deleteBeforeDateMs = Date.now() - afterNoLogInForMs + TIMEOUT_WHEN_NO_MORE_SO_FAR_MS
    const notifyBeforeDateMs = deleteBeforeDateMs + notifyBeforeMs

    const boolNotifSent = scope === 'deletion' ? '' : '!'
    const lastLoginBeforeDateMs = scope === 'deletion' ? deleteBeforeDateMs : notifyBeforeDateMs
    return (
      await sysEntitiesDB.query<WebUserRecord>(
        `
    FOR webUser IN @@webUserCollection
      FILTER  webUser.lastLogin.at < @lastLoginBeforeDate
              && ${boolNotifSent}webUser.lastLogin.inactiveNotificationSentAt
      LIMIT ${BATCH_SIZE}
      RETURN webUser
      `,
        {
          '@webUserCollection': WebUserCollection.name,
          'lastLoginBeforeDate': new Date(lastLoginBeforeDateMs).toISOString(),
        },
      )
    ).all()
  }
}
