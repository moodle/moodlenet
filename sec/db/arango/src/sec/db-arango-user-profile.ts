import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { _void } from '@moodle/lib-types'
import { aql } from 'arangojs'
import { dbStruct } from '../db-structure'
import { save_id_to_key } from '../lib/key-id-mapping'
import { getDraft, overUserProfileById } from './user-profile-db'

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
              return [false, _void]
            }
            return [true, _void]
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

            return [saveDone, _void]
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
            return [updateDone, _void]
          },
          async updateProfileImage({ lastEditDate, userProfileIdSelect, image, type }) {
            const updateResult = await overUserProfileById({
              dbStruct,
              userProfileIdSelect,
              apply: aql`
                UPDATE userProfileDoc WITH {
                                              info: MERGE(  UNSET(userProfileDoc.info, ${type}),
                                                            {
                                                              lastEditDate: ${lastEditDate},
                                                              [${type}]: ${image}
                                                            }
                                                          )
                                            } IN ${dbStruct.appData.coll.userProfile}`,
            })
            const updateDone = !!updateResult
            return [updateDone, _void]
          },
          async updateDraftResourceIngestionStatus({ eduResourceDraftId, resourceIngestionStatus, userProfileIdSelect }) {
            const updateResult = await overUserProfileById({
              dbStruct,
              userProfileIdSelect,
              apply: aql`
                FILTER ${eduResourceDraftId} IN userProfileDoc.myDrafts.eduResource[*].draftId
                UPDATE userProfileDoc WITH {
                  myDrafts: {
                    eduResource: (FOR draft IN userProfileDoc.myDrafts.eduResource
                                          RETURN draft.draftId == ${eduResourceDraftId}
                                                  ? MERGE( draft, {
                                                                    data:  {
                                                                      assetProcess: MERGE( UNSET(draft.data.assetProcess, 'resourceIngestionStatus'),{
                                                                        resourceIngestionStatus: ${resourceIngestionStatus},
                                                                      }),
                                                                    },
                                                                  })
                                                  : draft)
                  }
                } IN ${dbStruct.appData.coll.userProfile}
              `,
            })
            const updateDone = !!updateResult
            return [updateDone, _void]
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
                                              ? MERGE(draft,{
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
            return [updateDone, _void]
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
                                              ? MERGE_RECURSIVE(draft, {
                                                                lastEditDate: ${lastEditDate},
                                                                data: ${meta.data}
                                                              })
                                              : draft)
                  }
                } IN ${dbStruct.appData.coll.userProfile}
              `,
            })
            const updateDone = !!updateResult
            return [updateDone, _void]
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
