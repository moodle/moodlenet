import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { void_ } from '@moodle/lib-types'
import { aql } from 'arangojs'
import { dbStruct } from '../db-structure'
import { save_id_to_key } from '../lib/key-id-mapping'
import { getDraft, overUserProfileById } from './user-profile-db'
import { assetProcessStatus } from '@moodle/module/user-profile'
import { literal } from 'arangojs/aql'

export function user_profile_secondary_factory({ dbStruct }: { dbStruct: dbStruct }): secondaryProvider {
  return (/* secondaryCtx */) => {
    const secondaryAdapter: secondaryAdapter = {
      userProfile: {
        sync: {
          async userAccountExcerpt({ userAccountExcerpt }) {
            const userProfileDoc = await overUserProfileById({
              userProfileIdSelect: { by: 'userAccountId', userAccountId: userAccountExcerpt.id },
              dbStruct,
              apply: aql`UPDATE userProfileDoc WITH {
                userAccount: ${userAccountExcerpt}
              } IN ${dbStruct.appData.coll.userProfile}`,
            })
            if (!userProfileDoc) {
              return [false, void_]
            }
            return [true, void_]
          },
        },
        query: {
          async getUserProfile(select) {
            const userProfileRecord = await overUserProfileById({ dbStruct, userProfileIdSelect: select })
            if (!userProfileRecord) {
              return [false, { reason: 'notFound' }]
            }
            return [true, { userProfileRecord }]
          },
          async getDraft({ draftId, draftType, userProfileIdSelect }) {
            const draft = await getDraft({
              userProfileIdSelect,
              dbStruct,
              draftId,
              draftType,
            })
            if (!draft) {
              return [false, { reason: 'notFound' }]
            }
            return [true, draft]
          },
        },
        write: {
          async createUserProfile({ userProfileRecord }) {
            const result = await dbStruct.appData.coll.userProfile
              .save(save_id_to_key('id')(userProfileRecord))
              .catch(() => null)

            const saveDone = !!result

            return [saveDone, void_]
          },
          async updateProfileInfoMeta({ lastEditDate, userProfileIdSelect, profileInfoMeta }) {
            const updateResult = await overUserProfileById({
              dbStruct,
              userProfileIdSelect,
              apply: aql`UPDATE userProfileDoc WITH {
                info: ${{
                  lastEditDate,
                  ...profileInfoMeta,
                }}
              } IN ${dbStruct.appData.coll.userProfile}
            `,
            })
            const updateDone = !!updateResult
            return [updateDone, void_]
          },
          async updateProfileImage({ lastEditDate, userProfileIdSelect, image, type }) {
            const updateResult = await overUserProfileById({
              dbStruct,
              userProfileIdSelect,
              apply: aql`
                UPDATE userProfileDoc  WITH {
                                              info: MERGE(
                                                          UNSET(userProfileDoc.info, ${type}),
                                                          {
                                                            lastEditDate: ${lastEditDate},
                                                            [${type}]: ${image}
                                                          })
                                            } IN ${dbStruct.appData.coll.userProfile}`,
            })
            const updateDone = !!updateResult
            return [updateDone, void_]
          },
          async updateDraftResourceAssetProcessStatus({
            eduResourceDraftId,
            processStatus,
            processType,
            userProfileIdSelect,
            condition,
          }) {
            const processType_propName: keyof assetProcessStatus = processType
            const updateResult = await overUserProfileById({
              dbStruct,
              userProfileIdSelect,
              apply: aql`
                FILTER ${eduResourceDraftId} IN userProfileDoc.myDrafts.eduResource[*].draftId
                UPDATE userProfileDoc WITH {
                  myDrafts: {
                    eduResource: (  FOR draft IN userProfileDoc.myDrafts.eduResource
                                      LET isTargetDraft = draft.draftId == ${eduResourceDraftId}
                                      LET targetProcessStatus = draft.assetProcessStatus[${processType_propName}]
                                      LET conditionMet = targetProcessStatus.status == ${condition.status}
                                      LET updateThisDraft = isTargetDraft && conditionMet
                                      RETURN updateThisDraft
                                        ? MERGE(
                                                draft,
                                                {
                                                  assetProcessStatus: MERGE(
                                                                        UNSET(draft.assetProcessStatus, ${processType_propName}),
                                                                        {
                                                                          ${literal(processType_propName)}: ${processStatus},
                                                                        })
                                                })
                                        : draft )
                  }
                } IN ${dbStruct.appData.coll.userProfile}
              `,
            })

            const updateDone = !!updateResult
            return [updateDone, void_]
          },
          async updateDraftImage({ lastEditDate, userProfileIdSelect, image, draftId, draftType }) {
            const updateResult = await overUserProfileById({
              dbStruct,
              userProfileIdSelect,
              apply: aql`
                FILTER ${draftId} IN userProfileDoc.myDrafts[${draftType}][*].draftId
                UPDATE userProfileDoc WITH {
                  myDrafts: {
                    [${draftType}]: (FOR draft IN userProfileDoc.myDrafts[${draftType}]
                                      RETURN draft.draftId == ${draftId}
                                              ? MERGE(
                                                      draft,
                                                      {
                                                        lastEditDate: ${lastEditDate},
                                                        data: MERGE( UNSET(draft.data, 'image'), {
                                                          image: ${image}
                                                        }),
                                                      })
                                              : draft)
                  }
                } IN ${dbStruct.appData.coll.userProfile}
              `,
            })
            const updateDone = !!updateResult
            return [updateDone, void_]
          },
          async updateDraftMeta({ userProfileIdSelect, draftId, meta, lastEditDate }) {
            const updateResult = await overUserProfileById({
              dbStruct,
              userProfileIdSelect,
              apply: aql`
                FILTER ${draftId} IN userProfileDoc.myDrafts[${meta.type}][*].draftId
                UPDATE userProfileDoc WITH {
                  myDrafts: {
                    [${meta.type}]: (FOR draft IN userProfileDoc.myDrafts[${meta.type}]
                                      RETURN draft.draftId == ${draftId}
                                              ? MERGE_RECURSIVE(
                                                                draft,
                                                                {
                                                                  lastEditDate: ${lastEditDate},
                                                                  data: ${meta.data}
                                                                })
                                              : draft)
                  }
                } IN ${dbStruct.appData.coll.userProfile}
              `,
            })
            const updateDone = !!updateResult
            return [updateDone, void_]
          },
          async createDraft({ userProfileIdSelect, draft }) {
            const { draftId } = draft.data
            const createDraftUpdateResult = await overUserProfileById({
              dbStruct,
              userProfileIdSelect,
              apply: aql`
                FILTER ${draftId} NOT IN userProfileDoc.myDrafts[${draft.type}][*].draftId
                UPDATE userProfileDoc WITH {
                  myDrafts: {
                    [${draft.type}]: PUSH(userProfileDoc.myDrafts[${draft.type}], ${draft.data})
                  }
                } IN ${dbStruct.appData.coll.userProfile}
              `,
            })
            const updateDone = !!createDraftUpdateResult
            return [updateDone, void_]
          },
          /*  async updatePartialUserProfile({ userProfileId, partialUserProfile }) {
            const updateResult = await dbStruct.userAccount.coll.userProfile
              .update({ _key: userProfileId }, partialUserProfile, { returnNew: true })
              .catch(() => null)
            const updateDone = !!updateResult?.new
            return [updateDone, void_]
          }, */
        },
      },
    }
    return secondaryAdapter
  }
}
