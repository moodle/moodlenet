import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { _void } from '@moodle/lib-types'
import { dbStruct } from '../db-structure'
import { save_id_to_key } from '../lib/key-id-mapping'
import { getUserProfileById, updateUserProfileById } from './user-profile-db'

export function user_profile_secondary_factory({ dbStruct }: { dbStruct: dbStruct }): secondaryProvider {
  return secondaryCtx => {
    const secondaryAdapter: secondaryAdapter = {
      userProfile: {
        sync: {
          async userAccountExcerpt({ userAccountExcerpt }) {
            const userProfileDoc = await updateUserProfileById({
              select: { by: 'userAccountId', userAccountId: userAccountExcerpt.id },
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
          async getUserProfile(select) {
            const userProfileRecord = await getUserProfileById({ dbStruct, select })
            if (!userProfileRecord) {
              return [false, { reason: 'notFound' }]
            }
            return [true, { userProfileRecord }]
          },
        },
        write: {
          async updatePartialProfileInfo({ partialProfileInfo: partialProfileInfo, userProfileId }) {
            const updateResult = await dbStruct.userAccount.coll.userProfile
              .update({ _key: userProfileId }, { info: partialProfileInfo }, { returnNew: true })
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
          /*  async updatePartialUserProfile({ userProfileId, partialUserProfile }) {
            const updateResult = await dbStruct.userAccount.coll.userProfile
              .update({ _key: userProfileId }, partialUserProfile, { returnNew: true })
              .catch(() => null)
            const updateDone = !!updateResult?.new
            return [updateDone, _void]
          }, */
        },
      },
    }
    return secondaryAdapter
  }
}
