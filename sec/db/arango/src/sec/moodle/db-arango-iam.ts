import { moodle_secondary_adapter, moodle_secondary_factory } from '@moodle/domain'
import { _never } from '@moodle/lib-types'
import { Document } from 'arangojs/documents'
import { createHash } from 'node:crypto'
import { db_struct } from '../../db-structure'
import { getModConfigs } from '../../lib'
import { userDocument2user_record, user_record2userDocument } from './db-arango-iam-lib/mappings'
import { userDocument } from './db-arango-iam-lib/types'

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
                domain_endpoint: ctx.invoked_by,
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
              return [!!updated, _never]
            },
            async setUserRoles({ userId, roles }) {
              const {
                iam: {
                  coll: { user },
                },
              } = db_struct
              const updated = await user
                .update(
                  { _key: userId },
                  {
                    roles,
                  },
                  { silent: true },
                )
                .catch(() => null)
              return [!!updated, _never]
            },
            async getUserByEmail({ email }) {
              const {
                iam: {
                  db,
                  coll: { user },
                },
              } = db_struct
              const cursor = await db.query<Document<userDocument>>(
                `FOR user IN ${user.name} FILTER user.contacts.email == @email LIMIT 1 RETURN user`,
                { email },
              )
              const foundUser = await cursor.next()
              return foundUser ? [true, userDocument2user_record(foundUser)] : [false, _never]
            },
            async getUserById({ userId }) {
              const {
                iam: {
                  coll: { user },
                },
              } = db_struct

              const foundUser = await user.document({ _key: userId }, { graceful: true })
              return foundUser ? [true, userDocument2user_record(foundUser)] : [false, _never]
            },
            async saveNewUser({ newUser }) {
              const {
                iam: {
                  coll: { user },
                },
              } = db_struct
              const userDocument = user_record2userDocument(newUser)
              const savedUser = await user
                .save(userDocument, { overwriteMode: 'conflict' })
                .catch(() => null)

              return [!!savedUser, _never]
            },
            async deactivateUser({ anonymize, reason, userId, at = new Date().toISOString() }) {
              const {
                iam: {
                  coll: { user },
                },
              } = db_struct
              const deactivatingUser = await user.document({ _key: userId }, { graceful: true })
              if (!deactivatingUser) return [false, _never]

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

              await user.update(
                { _key: userId },
                {
                  deactivated: { anonymized: anonymize, at, reason },
                  ...anonymization,
                },
                { silent: true },
              )
              return [true, _never]
            },
            findUsersByText(_) {
              throw new Error('Not implemented')
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
