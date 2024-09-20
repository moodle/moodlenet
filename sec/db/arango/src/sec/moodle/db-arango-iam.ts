import { sec_factory, sec_impl } from '@moodle/domain'
import { _void } from '@moodle/lib-types'
import { Document } from 'arangojs/documents'
import { v1_0 } from '../..'
import { iamUserDoc2dbUser } from './db-arango-iam-lib/mappings'
import { generateId } from '@moodle/lib-id-gen'
import { createHash } from 'node:crypto'
import { DbUser } from '@moodle/mod-iam/v1_0/types'

export function iam({ db_struct_v1_0 }: { db_struct_v1_0: v1_0.db_struct }): sec_factory {
  return ctx => {
    const iam_sec_impl: sec_impl = {
      moodle: {
        iam: {
          v1_0: {
            sec: {
              db: {
                async getConfigs() {
                  const [{ configs: iam }, { configs: org }] = await Promise.all([
                    v1_0.getModConfigs({ mod_id: ctx.core_mod_id, db_struct_v1_0 }),
                    v1_0.getModConfigs({
                      // FIXME: let mod defs export their own mod_id --- nope check TODO #1
                      mod_id: { ns: 'moodle', mod: 'org', version: 'v1_0' },
                      db_struct_v1_0,
                    }),
                  ])
                  return { iam, org }
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
                      { silent: true },
                    )
                    .catch(() => null)
                  return [!!updated, _void]
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
                  return [!!updated, _void]
                },
                async getUserByEmail({ email }) {
                  const {
                    iam: {
                      db,
                      coll: { user },
                    },
                  } = db_struct_v1_0
                  const cursor = await db.query<Document<DbUser>>(
                    `FOR user IN ${user.name} FILTER user.contacts.email == @email LIMIT 1 RETURN user`,
                    { email },
                  )
                  const foundUser = await cursor.next()
                  return foundUser ? [true, iamUserDoc2dbUser(foundUser)] : [false, _void]
                },
                async getUserById({ userId }) {
                  const {
                    iam: {
                      coll: { user },
                    },
                  } = db_struct_v1_0

                  const foundUser = await user.document({ _key: userId }, { graceful: true })
                  return foundUser ? [true, iamUserDoc2dbUser(foundUser)] : [false, _void]
                },
                async saveNewUser({ idType, newUser }) {
                  const _key = await generateId(idType)
                  const {
                    iam: {
                      coll: { user },
                    },
                  } = db_struct_v1_0
                  const savedUser = await user
                    .save(
                      {
                        _key,
                        ...newUser,
                      },
                      { overwriteMode: 'conflict' },
                    )
                    .catch(() => null)

                  return savedUser ? [true, _key] : [false, _void]
                },
                async deactivateUser({ anonymize, reason, userId, at = new Date().toISOString() }) {
                  const {
                    iam: {
                      coll: { user },
                    },
                  } = db_struct_v1_0
                  const deactivatingUser = await user.document({ _key: userId }, { graceful: true })
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

                  await user.update(
                    { _key: userId },
                    {
                      deactivated: { anonymized: anonymize, at, reason },
                      ...anonymization,
                    },
                    { silent: true },
                  )
                  return [true, _void]
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
