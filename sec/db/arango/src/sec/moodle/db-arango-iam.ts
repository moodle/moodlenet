import { sec_factory, sec_impl } from '@moodle/domain'
import { _void } from '@moodle/lib-types'
import type { v1_0 as iam_v1_0 } from '@moodle/mod-iam'
import { Document } from 'arangojs/documents'
import { db_struct_v1_0 } from '../../dbStructure/v1_0'
import { getModConfigs } from '../../lib/modules'
import { dbUserDoc2DbUser } from './db-arango-iam-lib/mapping'

export function iam({ db_struct_v1_0 }: { db_struct_v1_0: db_struct_v1_0 }): sec_factory {
  return ctx => {
    const iam_sec_impl: sec_impl = {
      moodle: {
        iam: {
          v1_0: {
            sec: {
              db: {
                async getConfigs() {
                  const [{ configs: iam }, { configs: org }] = await Promise.all([
                    getModConfigs({ mod_id: ctx.core_mod_id, db_struct_v1_0 }),
                    getModConfigs({
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
                  const cursor = await db.query<Document<iam_v1_0.DbUser>>(
                    `FOR user IN ${user.name} FILTER user.contacts.email == @email LIMIT 1 RETURN user`,
                    { email },
                  )
                  const foundUser = await cursor.next()
                  return foundUser ? [true, dbUserDoc2DbUser(foundUser)] : [false, _void]
                },
                async getUserById({ userId }) {
                  const {
                    iam: {
                      coll: { user },
                    },
                  } = db_struct_v1_0

                  const foundUser = await user.document({ _key: userId }, { graceful: true })
                  return foundUser ? [true, dbUserDoc2DbUser(foundUser)] : [false, _void]
                },
                async saveNewUser({ newUser }) {
                  const {
                    iam: {
                      coll: { user },
                    },
                  } = db_struct_v1_0
                  const savedMeta = await user
                    .save({ _key: newUser.id, ...newUser }, { overwriteMode: 'conflict' })
                    .catch(() => null)

                  return [!!savedMeta, _void]
                },
                deactivateUser(_) {
                  throw new Error('Not implemented')
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
