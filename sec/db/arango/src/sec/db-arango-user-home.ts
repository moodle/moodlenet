import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { _void } from '@moodle/lib-types'
import { db_struct } from '../db-structure'
import { getUserHomeByUserId, updateUserHomeByUserId } from './db-arango-user-home-lib/lib'
import { user_home_record2userHomeDocument, userHomeDocument2user_home_record } from './db-arango-user-home-lib/mappings'

export function user_home_secondary_factory({ db_struct }: { db_struct: db_struct }): secondaryProvider {
  return secondaryCtx => {
    const secondaryAdapter: secondaryAdapter = {
      userHome: {
        sync: {
          async iamUserExcerpt({ iamUserExcerpt }) {
            const userHomeDoc = await updateUserHomeByUserId({
              userId: iamUserExcerpt.id,
              db_struct,
              partialUserHome: { iamUser: iamUserExcerpt },
            })
            if (!userHomeDoc) {
              return [false, _void]
            }
            return [true, _void]
          },
        },
        query: {
          async getUserHome({ by }) {
            const userHomeDoc =
              by.idOf === 'userHome'
                ? await db_struct.data.coll.userHome.document({ _key: by.userHomeId }).catch(() => null)
                : await getUserHomeByUserId({ db_struct, userId: by.userId })
            if (!userHomeDoc) {
              return [false, { reason: 'notFound' }]
            }
            return [true, { userHome: userHomeDocument2user_home_record(userHomeDoc) }]
          },
        },
        write: {
          async updatePartialProfileInfo({ partialProfileInfo, id }) {
            const updateResult = await db_struct.data.coll.userHome
              .update({ _key: id }, { profileInfo: partialProfileInfo }, { returnNew: true })
              .catch(() => null)
            return updateResult?.new ? [true, { userHomeId: id, userId: updateResult.new.iamUser.id }] : [false, _void]
          },
        },
        queue: {
          async createUserHome({ userHome }) {
            const result = await db_struct.data.coll.userHome
              .save(user_home_record2userHomeDocument(userHome))
              .catch(() => null)

            return [!!result, _void]
          },
        },
      },
    }
    return secondaryAdapter
  }
}
