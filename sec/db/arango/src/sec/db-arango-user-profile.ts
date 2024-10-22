import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { _void } from '@moodle/lib-types'
import { db_struct } from '../db-structure'
import { getUserProfileByUserId, updateUserProfileByUserId } from './db-arango-user-profile-lib/lib'
import {
  user_profile_record2userProfileDocument,
  userProfileDocument2user_profile_record,
} from './db-arango-user-profile-lib/mappings'

export function user_profile_secondary_factory({ db_struct }: { db_struct: db_struct }): secondaryProvider {
  return secondaryCtx => {
    const secondaryAdapter: secondaryAdapter = {
      userProfile: {
        sync: {
          async iamUserExcerpt({ iamUserExcerpt }) {
            const userProfileDoc = await updateUserProfileByUserId({
              userId: iamUserExcerpt.id,
              db_struct,
              partialUserProfile: { iamUser: iamUserExcerpt },
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
          async updatePartialProfileInfo({ partialProfileInfo, id }) {
            const updateResult = await db_struct.data.coll.userProfile
              .update({ _key: id }, { profileInfo: partialProfileInfo }, { returnNew: true })
              .catch(() => null)
            return updateResult?.new ? [true, { userProfileId: id, userId: updateResult.new.iamUser.id }] : [false, _void]
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
