import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { _void } from '@moodle/lib-types'
import { dbStruct } from '../db-structure'
import { save_id_to_key } from '../lib/key-id-mapping'
import { getUserProfileById, updateUserProfileById } from './user-profile-db'
import { aql } from 'arangojs'

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
          async getEduCollectionDraft({ eduCollectionDraftId, userProfileId }) {
            const userProfileRecord = await getUserProfileById({ select: { by: 'userProfileId', userProfileId }, dbStruct })
            const eduCollectionDraft = userProfileRecord?.myDrafts.eduCollections[eduCollectionDraftId]
            if (!eduCollectionDraft) {
              return [false, { reason: 'notFound' }]
            }
            return [true, eduCollectionDraft]
          },
          async getEduResourceDraft({ eduResourceDraftId, userProfileId }) {
            const userProfileRecord = await getUserProfileById({ select: { by: 'userProfileId', userProfileId }, dbStruct })
            const eduResourceDraft = userProfileRecord?.myDrafts.eduResources[eduResourceDraftId]
            if (!eduResourceDraft) {
              return [false, { reason: 'notFound' }]
            }
            return [true, eduResourceDraft]
          },
        },
        write: {
          async updatePartialProfileInfo({ partialProfileInfo, userProfileId }) {
            const updateResult = await updateUserProfileById({
              dbStruct,
              partialUserProfile: { info: partialProfileInfo },
              select: { by: 'userProfileId', userProfileId },
            })
            const updateDone = !!updateResult
            return [updateDone, _void]
          },
          async createUserProfile({ userProfileRecord }) {
            const result = await dbStruct.userAccount.coll.userProfile
              .save(save_id_to_key('id')(userProfileRecord))
              .catch(() => null)

            const saveDone = !!result

            return [saveDone, _void]
          },
          async updateEduCollectionDraft({ userProfileId, eduCollectionDraftId, partialEduCollectionDraft }) {
            const updateResult = await updateUserProfileById({
              dbStruct,
              preCondition: aql`FILTER HAS( userProfileDoc.myDrafts.eduCollections, ${eduCollectionDraftId} )`,
              partialUserProfile: {
                myDrafts: {
                  eduCollections: {
                    [eduCollectionDraftId]: partialEduCollectionDraft,
                  },
                },
              },
              select: { by: 'userProfileId', userProfileId },
            })
            const updateDone = !!updateResult
            return [updateDone, _void]
          },
          async createEduCollectionDraft({ userProfileId, eduCollectionDraftId, eduCollectionDraft }) {
            const updateResult = await updateUserProfileById({
              dbStruct,
              preCondition: aql`FILTER NOT( HAS( userProfileDoc.myDrafts.eduCollections, ${eduCollectionDraftId} ) )`,
              partialUserProfile: {
                myDrafts: {
                  eduCollections: {
                    [eduCollectionDraftId]: eduCollectionDraft,
                  },
                },
              },
              select: { by: 'userProfileId', userProfileId },
            })
            const updateDone = !!updateResult
            return [updateDone, _void]
          },
          async updateEduResourceDraft({ userProfileId, eduResourceDraftId, partialEduResourceDraft }) {
            const updateResult = await updateUserProfileById({
              dbStruct,
              preCondition: aql`FILTER HAS( userProfileDoc.myDrafts.eduResources, ${eduResourceDraftId} )`,
              partialUserProfile: {
                myDrafts: {
                  eduResources: {
                    [eduResourceDraftId]: partialEduResourceDraft,
                  },
                },
              },
              select: { by: 'userProfileId', userProfileId },
            })
            const updateDone = !!updateResult
            return [updateDone, _void]
          },
          async createEduResourceDraft({ userProfileId, eduResourceDraftId, eduResourceDraft }) {
            const updateResult = await updateUserProfileById({
              dbStruct,
              preCondition: aql`FILTER NOT( HAS( userProfileDoc.myDrafts.eduResources, ${eduResourceDraftId} ) )`,
              partialUserProfile: {
                myDrafts: {
                  eduResources: {
                    [eduResourceDraftId]: eduResourceDraft,
                  },
                },
              },
              select: { by: 'userProfileId', userProfileId },
            })
            const updateDone = !!updateResult
            return [updateDone, _void]
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
