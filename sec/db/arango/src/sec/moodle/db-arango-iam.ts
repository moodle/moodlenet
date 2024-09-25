import { sec_factory, sec_impl } from '@moodle/lib-ddd'
import { _never } from '@moodle/lib-types'
import { Document } from 'arangojs/documents'
import { createHash } from 'node:crypto'
import { v1_0 } from '../..'
import { userDocument2userRecord, userRecord2userDocument } from './db-arango-iam-lib/mappings'
import { userDocument } from './db-arango-iam-lib/types'

export function iam({ db_struct_v1_0 }: { db_struct_v1_0: v1_0.db_struct }): sec_factory {
  return ctx => {
    const iam_sec_impl: sec_impl = {
      moodle: {
        iam: {
          v1_0: {
            sec: {
              db: {
                async getConfigs() {
                  const { configs } = await v1_0.getModConfigs({
                    mod_id: ctx.core_mod_id,
                    db_struct_v1_0,
                  })
                  return { configs }
                },
                async changeUserPassword({ newPasswordHash, userId }) {
                  const {
                    iam: {
                      coll: { user },
                    },
                  } = db_struct_v1_0
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
                async changeUserRoles({ userId, roles }) {
                  const {
                    iam: {
                      coll: { user },
                    },
                  } = db_struct_v1_0
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
                  } = db_struct_v1_0
                  const cursor = await db.query<Document<userDocument>>(
                    `FOR user IN ${user.name} FILTER user.contacts.email == @email LIMIT 1 RETURN user`,
                    { email },
                  )
                  const foundUser = await cursor.next()
                  return foundUser ? [true, userDocument2userRecord(foundUser)] : [false, _never]
                },
                async getUserById({ userId }) {
                  const {
                    iam: {
                      coll: { user },
                    },
                  } = db_struct_v1_0

                  const foundUser = await user.document({ _key: userId }, { graceful: true })
                  return foundUser ? [true, userDocument2userRecord(foundUser)] : [false, _never]
                },
                async saveNewUser({ newUser }) {
                  const {
                    iam: {
                      coll: { user },
                    },
                  } = db_struct_v1_0
                  const userDocument = userRecord2userDocument(newUser)
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
                  } = db_struct_v1_0
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
        },
      },
    }
    return iam_sec_impl
  }
}
