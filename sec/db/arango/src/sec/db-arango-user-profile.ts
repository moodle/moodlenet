import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { _void } from '@moodle/lib-types'
import { dbStruct } from '../db-structure'
import { getUserProfileByUserAccountId, updateUserProfileByUserAccountId } from './user-profile-db'
import { restore_record, save_id_to_key } from '../lib/key-id-mapping'

export function user_profile_secondary_factory({ dbStruct }: { dbStruct: dbStruct }): secondaryProvider {
  return secondaryCtx => {
    const secondaryAdapter: secondaryAdapter = {
      userProfile: {
        sync: {
          async userAccountExcerpt({ userAccountExcerpt }) {
            const userProfileDoc = await updateUserProfileByUserAccountId({
              userAccountId: userAccountExcerpt.id,
              dbStruct,
              partialUserProfile: { userAccount: userAccountExcerpt },
            })
            if (!userProfileDoc) {
              return [false, _void]
            }
            return [true, _void]
          },
        },
        query: {
          async getUserProfile(get) {
            const userProfileRecord =
              get.by === 'userProfileId'
                ? await dbStruct.userAccount.coll.userProfile
                    .document({ _key: get.userProfileId })
                    .then(restore_record)
                    .catch(() => null)
                : await getUserProfileByUserAccountId({ dbStruct, userAccountId: get.userAccountId })
            if (!userProfileRecord) {
              return [false, { reason: 'notFound' }]
            }
            return [true, { userProfileRecord }]
          },
        },
        write: {
          async updatePartialProfileInfo({ partialProfileInfo, userProfileId }) {
            const updateResult = await dbStruct.userAccount.coll.userProfile
              .update({ _key: userProfileId }, { info: partialProfileInfo }, { returnNew: true })
              .catch(() => null)
            const updateDone = !!updateResult?.new
            return [updateDone, _void]
          },
          async updatePartialUserProfile({ userProfileId, partialUserProfile }) {
            const updateResult = await dbStruct.userAccount.coll.userProfile
              .update({ _key: userProfileId }, partialUserProfile, { returnNew: true })
              .catch(() => null)
            const updateDone = !!updateResult?.new
            return [updateDone, _void]
          },
          async createUserProfile({ userProfileRecord }) {
            const result = await dbStruct.userAccount.coll.userProfile
              .save(save_id_to_key(userProfileRecord))
              .catch(() => null)

            const saveDone = !!result

            return [saveDone, _void]
          },
        },
      },
    }
    return secondaryAdapter
  }
}
