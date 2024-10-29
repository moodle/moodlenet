import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { _void, date_time_string } from '@moodle/lib-types'
import { userAccountRecord } from '@moodle/module/user-account'
import { aql } from 'arangojs'
import { createHash } from 'node:crypto'
import { dbStruct } from '../db-structure'
import { restore_maybe_record, save_id_to_key } from '../lib/key-id-mapping'
import { getUserByEmail, getUserById } from './user-account-db'

export function user_account_secondary_factory({ dbStruct }: { dbStruct: dbStruct }): secondaryProvider {
  return secondaryCtx => {
    const secondaryAdapter: secondaryAdapter = {
      userAccount: {
        sync: {
          async userDisplayname({ displayName, userAccountId }) {
            const done = !!(await dbStruct.userAccount.coll.userAccount
              .update({ _key: userAccountId }, { displayName })
              .catch(() => null))
            return [done, _void]
          },
        },
        write: {
          async saveNewUser({ newUser }) {
            const savedUser = await dbStruct.userAccount.coll.userAccount
              .save(save_id_to_key(newUser), { overwriteMode: 'conflict', returnNew: true })
              .catch(() => null)

            return [!!savedUser?.new, _void]
          },
          async deactivateUser({
            anonymize,
            reason,
            userAccountId,
            overrideDeactivationDate: date = date_time_string('now'),
          }) {
            const deactivatingUser = await dbStruct.userAccount.coll.userAccount.document(
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

            const deactivatedUserAccountRecord = await dbStruct.userAccount.coll.userAccount
              .update(
                { _key: userAccountId },
                {
                  deactivated: { anonymized: anonymize, date, reason },
                  ...anonymization,
                },
                { returnOld: true },
              )
              .then(({ old }) => old)
              .then(restore_maybe_record)
              .catch(() => null)

            return deactivatedUserAccountRecord ? [true, { deactivatedUserAccountRecord }] : [false, _void]
          },

          async setUserPassword({ newPasswordHash, userAccountId }) {
            const {
              userAccount: {
                coll: { userAccount: user },
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
            const updated = await dbStruct.userAccount.coll.userAccount
              .update({ _key: userAccountId }, { roles }, { returnOld: true })
              .then(({ old }) => old)
              .then(restore_maybe_record)
              .catch(() => null)
            return updated ? [true, { newRoles: roles, oldRoles: updated.roles }] : [false, _void]
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
              ? aql`LET sim = NGRAM_SIMILARITY(LOWER(userAccountDoc.displayName),${lowerCaseText},2) + NGRAM_SIMILARITY(LOWER(userAccountDoc.contacts.email),${lowerCaseText},2)
                      FILTER sim > 0.5
                      SORT sim DESC`
              : aql``
            const deactivatedFilter = includeDeactivated ? aql`` : aql`FILTER NOT(userAccountDoc.deactivated)`
            const userDocs_cursor = await dbStruct.userAccount.db.query<userAccountRecord>(
              aql`
                FOR userAccountDoc IN ${dbStruct.userAccount.coll.userAccount}
                ${deactivatedFilter}
                ${textFilter}
                LIMIT 50
                RETURN MOODLE::RESTORE_RECORD(userAccountDoc)
                `,
            )
            const userAccountRecords = await userDocs_cursor.all()
            return { userAccountRecords }
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
