import { moodle_secondary_adapter, moodle_secondary_factory } from '@moodle/domain'
import { _void } from '@moodle/lib-types'
import { db_struct } from '../db-structure'
import { getModConfigs, updateDeepPartialModConfigs } from '../lib/modules'
import { getUserHomeByUserId, updateUserHomeByUserId } from './db-arango-user-home-lib/lib'
import {
  user_home_record2userHomeDocument,
  userHomeDocument2user_home_record,
} from './db-arango-user-home-lib/mappings'

export function user_home_moodle_secondary_factory({
  db_struct,
}: {
  db_struct: db_struct
}): moodle_secondary_factory {
  return ctx => {
    const moodle_secondary_adapter: moodle_secondary_adapter = {
      secondary: {
        userHome: {
          alignDb: {
            async userExcerpt({ userExcerpt }) {
              const userHomeDoc = await updateUserHomeByUserId({
                userId: userExcerpt.id,
                db_struct,
                pUserHome: { user: userExcerpt },
              })
              if (!userHomeDoc) {
                return [false, { reason: 'notFound' }]
              }
              //NOTE: throw no event : userExcerpt is data from iamUser
              return [true, { userHome: userHomeDocument2user_home_record(userHomeDoc) }]
            },
          },
          db: {
            async getUserHome({ by }) {
              const userHomeDoc =
                by.idOf === 'user_home'
                  ? await db_struct.data.coll.userHome
                      .document({ _key: by.user_home_id })
                      .catch(() => null)
                  : await getUserHomeByUserId({ db_struct, userId: by.user_id })
              if (!userHomeDoc) {
                return [false, { reason: 'notFound' }]
              }
              return [true, { userHome: userHomeDocument2user_home_record(userHomeDoc) }]
            },
            async updatePartialProfileInfo({ partialProfileInfo, id }) {
              const updateResult = await db_struct.data.coll.userHome
                .update({ _key: id }, { profileInfo: partialProfileInfo }, { returnNew: true })
                .catch(() => null)
              return updateResult?.new
                ? [true, { userHomeId: id, userId: updateResult.new.user.id }]
                : [false, _void]
            },
            async createUserHome({ userHome }) {
              const result = await db_struct.data.coll.userHome
                .save(user_home_record2userHomeDocument(userHome))
                .catch(() => null)

              return [!!result, _void]
            },
          },
        },
      },
    }
    return moodle_secondary_adapter
  }
}
