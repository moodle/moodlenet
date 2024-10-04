import { moodle_secondary_adapter, moodle_secondary_factory } from '@moodle/domain'
import { _void } from '@moodle/lib-types'
import { Document } from 'arangojs/documents'
import { createHash } from 'node:crypto'
import { db_struct } from '../db-structure'
import { getModConfigs } from '../lib'
import { userDocument2user_record, user_record2userDocument } from './db-arango-iam-lib/mappings'
import { userDocument } from './db-arango-iam-lib/types'
import { aql } from 'arangojs'

export function iam_moodle_secondary_factory({
  db_struct,
}: {
  db_struct: db_struct
}): moodle_secondary_factory {
  return ctx => {
    const moodle_secondary_adapter: moodle_secondary_adapter = {
      secondary: {
        iam: {
          db: {
            async getConfigs() {
              const { configs } = await getModConfigs({
                moduleName: ctx.invoked_by.module,
                db_struct,
              })
              return { configs }
            },
            async setUserPassword({ newPasswordHash, userId }) {
              const {
                iam: {
                  coll: { user },
                },
              } = db_struct
              const updated = await user
                .update(
                  { _key: userId },
                  {
                    passwordHash: newPasswordHash,
                  },
                )
                .catch(() => null)
              updated && ctx.emit.event.iam.userSecurity.userPasswordChanged({ userId })
              return [!!updated, _void]
            },
            async align_userDisplayname({displayName,userId}) {
              const done = !!(await db_struct.iam.coll.user.update({_key:userId},{displayName}).catch(()=>null))
              return [done, _void]

            },
            async setUserRoles({ userId, roles }) {
              const updated = await db_struct.iam.coll.user
                .update({ _key: userId }, { roles }, { returnNew: true, returnOld: true })
                .catch(() => null)

                updated?.old &&
                  ctx.emit.event.iam.userRoles.userRolesUpdated({
                    userId,
                    oldRoles: updated.old.roles,
                    roles,
                  })
                return [!!updated, _void]
            },
            async getUserByEmail({ email }) {
              const cursor = await db_struct.iam.db.query<Document<userDocument>>(
                `FOR user IN ${db_struct.iam.coll.user.name} FILTER user.contacts.email == @email LIMIT 1 RETURN user`,
                { email },
              )
              const foundUser = await cursor.next()
              return foundUser ? [true, userDocument2user_record(foundUser)] : [false, _void]
            },
            async getUserById({ userId }) {
              const foundUser = await db_struct.iam.coll.user.document(
                { _key: userId },
                { graceful: true },
              )
              return foundUser ? [true, userDocument2user_record(foundUser)] : [false, _void]
            },
            async saveNewUser({ newUser }) {
              const userDocument = user_record2userDocument(newUser)
              const savedUser = await db_struct.iam.coll.user
                .save(userDocument, { overwriteMode: 'conflict', returnNew: true })
                .catch(() => null)

              savedUser?.new &&
                ctx.emit.event.iam.userBase.newUserCreated({
                  user: userDocument2user_record(savedUser.new),
                })
              return [!!savedUser, _void]
            },
            async deactivateUser({ anonymize, reason, userId, at = new Date().toISOString() }) {
              const deactivatingUser = await db_struct.iam.coll.user.document(
                { _key: userId },
                { graceful: true },
              )
              if (!deactivatingUser) return [false, _void]

              const anonymization = anonymize
                ? {
                    displayName: '',
                    roles: [],
                    contacts: {
                      email: createHash('md5')
                        .update(`${deactivatingUser.contacts.email}|${at}`)
                        .digest('base64'),
                    },
                    passwordHash: '',
                  }
                : null

              const deactivatedUser = await db_struct.iam.coll.user.update(
                { _key: userId },
                {
                  deactivated: { anonymized: anonymize, at, reason },
                  ...anonymization,
                },
                { silent: true },
              )
              deactivatedUser &&
                ctx.emit.event.iam.userBase.userDeactivated({
                  user: userDocument2user_record(deactivatingUser),
                  reason,
                  anonymized: anonymize,
                })
              return [true, _void]
            },
            async findUsersByText({ text, includeDeactivated }) {
              const lowerCaseText = text.toLowerCase()
              const textFilter = text
                ? aql`LET sim = NGRAM_SIMILARITY(LOWER(user.displayName),${lowerCaseText},2) + NGRAM_SIMILARITY(LOWER(user.contacts.email),${lowerCaseText},2)
                      FILTER sim > 0.5
                      SORT sim DESC`
                : aql``
              const deactivatedFilter = includeDeactivated
                ? aql``
                : aql`FILTER NOT(user.deactivated)`
              const userDocs_cursor = await db_struct.iam.db.query<userDocument>(
                aql`
                FOR user IN ${db_struct.iam.coll.user}
                ${deactivatedFilter}
                ${textFilter}
                LIMIT 50
                RETURN user
                `,
              )
              const userDocs = await userDocs_cursor.all()
              return { users: userDocs.map(userDocument2user_record) }
            },
            getActiveUsersNotLoggedInFor(_) {
              throw new Error('Not implemented')
            },
          },
        },
      },
    }
    return moodle_secondary_adapter
  }
}
