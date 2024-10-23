import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { _void } from '@moodle/lib-types'
import { dbStruct } from '../db-structure'
import {
  getUserProfileByUserAccountId,
  updateUserProfileByUserAccountId,
  userProfileRecord2userProfileDocument,
  userProfileDocument2userProfileRecord,
} from './user-profile-db'

export function user_profile_secondary_factory({ dbStruct }: { dbStruct: dbStruct }): secondaryProvider {
  return secondaryCtx => {
    const secondaryAdapter: secondaryAdapter = {
      userProfile: {
        sync: {
          async userAccountUserExcerpt({ userAccountUserExcerpt }) {
            const userProfileDoc = await updateUserProfileByUserAccountId({
              userAccountId: userAccountUserExcerpt.id,
              dbStruct,
              partialUserProfile: { userAccountUser: userAccountUserExcerpt },
            })
            if (!userProfileDoc) {
              return [false, _void]
            }
            return [true, _void]
          },
        },
        query: {
          async getUserProfile(get) {
            const userProfileDoc =
              get.by === 'userProfileId'
                ? await dbStruct.data.coll.userProfile.document({ _key: get.userProfileId }).catch(() => null)
                : await getUserProfileByUserAccountId({ dbStruct, userAccountId: get.userAccountId })
            if (!userProfileDoc) {
              return [false, { reason: 'notFound' }]
            }
            return [true, { userProfile: userProfileDocument2userProfileRecord(userProfileDoc) }]
          },
        },
        write: {
          async updatePartialProfileInfo({ partialProfileInfo, userProfileId }) {
            const updateResult = await dbStruct.data.coll.userProfile
              .update({ _key: userProfileId }, { info: partialProfileInfo }, { returnNew: true })
              .catch(() => null)
            return updateResult?.new ? [true, _void] : [false, _void]
          },
          async updatePartialUserProfile({ userProfileId, partialUserProfile }) {
            const updateResult = await dbStruct.data.coll.userProfile
              .update({ _key: userProfileId }, partialUserProfile, { returnNew: true })
              .catch(() => null)
            return updateResult?.new ? [true, _void] : [false, _void]
          },
        },
        queue: {
          async createUserProfile({ userProfile }) {
            const result = await dbStruct.data.coll.userProfile
              .save(userProfileRecord2userProfileDocument(userProfile))
              .catch(() => null)

            return [!!result, _void]
          },
        },
      },
    }
    return secondaryAdapter
  }
}
