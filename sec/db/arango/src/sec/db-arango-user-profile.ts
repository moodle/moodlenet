import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { _void } from '@moodle/lib-types'
import { db_struct } from '../db-structure'
import {
  getUserProfileByUserId,
  updateUserProfileByUserId,
  user_profile_record2userProfileDocument,
  userProfileDocument2user_profile_record,
} from './db-arango-user-profile-lib'

export function user_profile_secondary_factory({ db_struct }: { db_struct: db_struct }): secondaryProvider {
  return secondaryCtx => {
    const secondaryAdapter: secondaryAdapter = {
      userProfile: {
        sync: {
          async userAccountUserExcerpt({ userAccountUserExcerpt }) {
            const userProfileDoc = await updateUserProfileByUserId({
              userId: userAccountUserExcerpt.id,
              db_struct,
              partialUserProfile: { userAccountUser: userAccountUserExcerpt },
            })
            if (!userProfileDoc) {
              return [false, _void]
            }
            return [true, _void]
          },
        },
        query: {
          async getUserProfile({ by }) {
            const userProfileDoc =
              by.idOf === 'userProfile'
                ? await db_struct.data.coll.userProfile.document({ _key: by.userProfileId }).catch(() => null)
                : await getUserProfileByUserId({ db_struct, userId: by.userId })
            if (!userProfileDoc) {
              return [false, { reason: 'notFound' }]
            }
            return [true, { userProfile: userProfileDocument2user_profile_record(userProfileDoc) }]
          },
        },
        write: {
          async updatePartialProfileInfo({ partialProfileInfo, userProfileId }) {
            const updateResult = await db_struct.data.coll.userProfile
              .update({ _key: userProfileId }, { info: partialProfileInfo }, { returnNew: true })
              .catch(() => null)
            return updateResult?.new ? [true, _void] : [false, _void]
          },
          async updatePartialUserProfile({ userProfileId, partialUserProfile }) {
            const updateResult = await db_struct.data.coll.userProfile
              .update({ _key: userProfileId }, partialUserProfile, { returnNew: true })
              .catch(() => null)
            return updateResult?.new ? [true, _void] : [false, _void]
          },
        },
        queue: {
          async createUserProfile({ userProfile }) {
            const result = await db_struct.data.coll.userProfile
              .save(user_profile_record2userProfileDocument(userProfile))
              .catch(() => null)

            return [!!result, _void]
          },
        },
      },
    }
    return secondaryAdapter
  }
}
