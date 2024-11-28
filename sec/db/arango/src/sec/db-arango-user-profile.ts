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
                userAccount: userAccountExcerpt
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
                REPLACE MERGE_RECURSIVE(userProfileDoc, {
                                                          info: {
                                                            [${type}]: null
                                                          }
                                                        }, {
                                                          info: {
                                                            lastEditDate: ${lastEditDate},
                                                            [${type}]: ${image}
                                                          }
                                                        }) IN ${dbStruct.appData.coll.userProfile}`,
            })
            const updateDone = !!updateResult
            return [updateDone, _void]
          },
          async updateDraftImage({ lastEditDate, userProfileIdSelect, image, draftId, draftType }) {
            const updateResult = await overUserProfileById({
              dbStruct,
              userProfileIdSelect,
              apply: aql`
                FILTER HAS( userProfileDoc.myDrafts[${draftType}], ${draftId} )
                REPLACE MERGE_RECURSIVE(userProfileDoc, {
                                                          myDrafts: {
                                                            [${draftType}]: {
                                                              [${draftId}]: {
                                                                data: {
                                                                  image: null
                                                                },
                                                              },
                                                            },
                                                          },
                                                        }, {
                                                          myDrafts: {
                                                            [${draftType}]: {
                                                              [${draftId}]: {
                                                                lastEditDate: ${lastEditDate},
                                                                data: {
                                                                  image: ${image}
                                                                },
                                                              },
                                                            },
                                                          },
                                                        }) IN ${dbStruct.appData.coll.userProfile}
              `,
            })
            const updateDone = !!updateResult
            return [updateDone, _void]
          },
          async updateDraftMeta({ userProfileIdSelect, draftId, draftType, meta, lastEditDate }) {
            const updateResult = await overUserProfileById({
              dbStruct,
              userProfileIdSelect,
              apply: aql`
                FILTER HAS( userProfileDoc.myDrafts[${draftType}], ${draftId} )
                UPDATE userProfileDoc WITH {
                  myDrafts: {
                    [${draftType}]: {
                      [${draftId}]: {
                        lastEditDate: ${lastEditDate},
                        data: ${meta}
                      }
                    }
                  }
                } IN ${dbStruct.appData.coll.userProfile}
              `,
            })
            const updateDone = !!updateResult
            return [updateDone, _void]
          },
          async createDraft({ userProfileIdSelect, draft, draftId, draftType }) {
            const createDraftUpdateResult = await overUserProfileById({
              dbStruct,
              userProfileIdSelect,
              apply: aql`
                FILTER NOT( HAS( userProfileDoc.myDrafts[${draftType}], ${draftId} ) )
                UPDATE userProfileDoc WITH {
                  myDrafts: {
                    [${draftType}]: {
                      [${draftId}]: ${draft}
                    }
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
