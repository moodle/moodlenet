import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { _void, date_time_string } from '@moodle/lib-types'
import { aql } from 'arangojs'
import { createHash } from 'node:crypto'
import { dbStruct } from '../db-structure'
import {
  getUserByEmail,
  getUserById,
  userAccountDocument,
  userAccountDocument2userAccountRecord,
  userAccountRecord2userAccountDocument,
} from './user-account-db'

export function user_account_secondary_factory({ dbStruct }: { dbStruct: dbStruct }): secondaryProvider {
  return secondaryCtx => {
    const secondaryAdapter: secondaryAdapter = {
      userAccount: {
        sync: {
          async userDisplayname({ displayName, userAccountId }) {
            const done = !!(await dbStruct.userAccount.coll.user
              .update({ _key: userAccountId }, { displayName })
              .catch(() => null))
            return [done, _void]
          },
        },
        write: {
          async saveNewUser({ newUser }) {
            const userAccountDocument = userAccountRecord2userAccountDocument(newUser)
            const savedUser = await dbStruct.userAccount.coll.user
              .save(userAccountDocument, { overwriteMode: 'conflict', returnNew: true })
              .catch(() => null)

            return [!!savedUser?.new, _void]
          },
          async deactivateUser({
            anonymize,
            reason,
            userAccountId,
            overrideDeactivationDate: date = date_time_string('now'),
          }) {
            const deactivatingUser = await dbStruct.userAccount.coll.user.document(
              { _key: userAccountId },
              { graceful: true },
            )
            if (!deactivatingUser) return [false, _void]

            const anonymization = anonymize
              ? {
                  displayName: '',
                  roles: [],
                  contacts: {
                    email: createHash('md5').update(`${deactivatingUser.contacts.email}|${date}`).digest('base64'),
                  },
                  passwordHash: '',
                }
              : null

            const deactivatedUser = await dbStruct.userAccount.coll.user
              .update(
                { _key: userAccountId },
                {
                  deactivated: { anonymized: anonymize, date, reason },
                  ...anonymization,
                },
                { returnOld: true },
              )
              .catch(() => null)
            return deactivatedUser?.old
              ? [true, { deactivatedUser: userAccountDocument2userAccountRecord(deactivatedUser.old) }]
              : [false, _void]
          },
          async setUserPassword({ newPasswordHash, userAccountId }) {
            const {
              userAccount: {
                coll: { user },
              },
            } = dbStruct
            const updated = await user
              .update(
                { _key: userAccountId },
                {
                  passwordHash: newPasswordHash,
                },
              )
              .catch(() => null)
            return [!!updated, _void]
          },
          async setUserRoles({ userAccountId, roles }) {
            const updated = await dbStruct.userAccount.coll.user
              .update({ _key: userAccountId }, { roles }, { returnOld: true })
              .catch(() => null)
            return updated?.old ? [true, { newRoles: roles, oldRoles: updated.old.roles }] : [false, _void]
          },
        },
        query: {
          async userBy(q) {
            return q.by === 'email'
              ? getUserByEmail({ email: q.email, dbStruct })
              : getUserById({ userAccountId: q.userAccountId, dbStruct })
          },

          async usersByText({ text, includeDeactivated }) {
            const lowerCaseText = text.toLowerCase()
            const textFilter = text
              ? aql`LET sim = NGRAM_SIMILARITY(LOWER(user.displayName),${lowerCaseText},2) + NGRAM_SIMILARITY(LOWER(user.contacts.email),${lowerCaseText},2)
                      FILTER sim > 0.5
                      SORT sim DESC`
              : aql``
            const deactivatedFilter = includeDeactivated ? aql`` : aql`FILTER NOT(user.deactivated)`
            const userDocs_cursor = await dbStruct.userAccount.db.query<userAccountDocument>(
              aql`
                FOR user IN ${dbStruct.userAccount.coll.user}
                ${deactivatedFilter}
                ${textFilter}
                LIMIT 50
                RETURN user
                `,
            )
            const userDocs = await userDocs_cursor.all()
            return { users: userDocs.map(userAccountDocument2userAccountRecord) }
          },
          activeUsersNotLoggedInFor(_) {
            throw new Error('Not implemented')
          },
        },
      },
    }
    return secondaryAdapter
  }
}
