import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { void_, deep_partial_props } from '@moodle/lib-types'
import { userAccountRecord } from '@moodle/module/user-account'
import { aql } from 'arangojs'
import { createHash } from 'node:crypto'
import { dbStruct } from '../db-structure'
import { save_id_to_key } from '../lib/key-id-mapping'
import { getUserByEmail, getUserById } from './user-account-lib'

export function user_account_secondary_factory({ dbStruct }: { dbStruct: dbStruct }): secondaryProvider {
  return ctx => {
    const secondaryAdapter: secondaryAdapter = {
      userAccount: {
        sync: {
          async userDisplayname({ displayName, userAccountId }) {
            const done = !!(await dbStruct.identity.coll.user
              .update({ _key: userAccountId }, { displayName })
              .catch(() => null))
            return [done, void_]
          },
        },
        write: {
          async saveNewUser({ newUser }) {
            const savedUser = await dbStruct.identity.coll.user
              .save(save_id_to_key('id')(newUser), { overwriteMode: 'conflict', returnNew: true })
              .catch(() => null)

            return [!!savedUser?.new, void_]
          },
          async deactivateUser({ anonymize, reason, userAccountId, overrideDeactivationDate: date = ctx.now }) {
            const deactivatingUser = await dbStruct.identity.coll.user.document({ _key: userAccountId }, { graceful: true })
            if (!deactivatingUser) return [false, void_]

            const anonymization: null | deep_partial_props<userAccountRecord> = anonymize
              ? {
                  displayName: '',
                  roles: [],
                  contacts: {
                    email: createHash('md5').update(`${deactivatingUser.contacts.email}|${date}`).digest('base64'),
                  },
                  passwordHash: '',
                }
              : null

            const updateRecordWith: deep_partial_props<userAccountRecord> = {
              deactivated: { anonymized: anonymize, date, reason },
              ...anonymization,
            }

            const deactivatedUserAccount_cursor = await dbStruct.identity.db.query<userAccountRecord>(`
                FOR userAccountDoc IN ${dbStruct.identity.coll.user}
                FILTER userAccountDoc._key == ${userAccountId}
                LIMIT 1
                UPDATE userAccountDoc WITH ${updateRecordWith} IN ${dbStruct.identity.coll.user}
                RETURN MOODLE::RESTORE_RECORD_ID(OLD)
              `)
            const [deactivatedUserAccountRecord] = await deactivatedUserAccount_cursor.all()

            return deactivatedUserAccountRecord ? [true, { deactivatedUserAccountRecord }] : [false, void_]
          },

          async setUserPassword({ newPasswordHash, userAccountId }) {
            const {
              identity: {
                coll: { user: user },
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
            return [!!updated, void_]
          },
          async setUserRoles({ userAccountId, roles, addRoleHistoryItem }) {
            const updatedUserRoles_cursor = await dbStruct.identity.db.query<userAccountRecord>(aql`
                FOR userAccountDoc IN ${dbStruct.identity.coll.user}
                FILTER userAccountDoc._key == ${userAccountId}
                LIMIT 1
                UPDATE userAccountDoc WITH {
                  roles: ${roles}
                  roleHistory: UNIQUE( UNSHIFT(userAccountDoc.roleHistory, ${addRoleHistoryItem}) )
                } IN ${dbStruct.identity.coll.user}
                RETURN MOODLE::RESTORE_RECORD_ID(OLD)
              `)
            const [updated] = await updatedUserRoles_cursor.all()
            return updated ? [true, { newRoles: roles, oldRoles: updated.roles }] : [false, void_]
          },
        },
        query: {
          async findUser(q) {
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
            const userDocs_cursor = await dbStruct.identity.db.query<userAccountRecord>(
              aql`
                FOR userAccountDoc IN ${dbStruct.identity.coll.user}
                ${deactivatedFilter}
                ${textFilter}
                LIMIT 50
                RETURN MOODLE::RESTORE_RECORD_ID(userAccountDoc)
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
