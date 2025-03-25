import { generateAlphanumId } from '@moodle/lib-id-gen'
import { omit } from 'lodash'
import UserProfileDomain, { eduCollectionDraft } from '..'
import { assertWithError4xx, moduleCore } from '../../../types'
import { maybeAsset, NONE_ASSET } from '../../storage'
import { assert_authorizeAuthenticatedCurrentUserSession } from '../../user-account/lib'
import { createNewEduResourceDraftData, createNewUserProfileData } from './lib/data'

type primary = UserProfileDomain['primary']['userProfile']
export const user_profile_core: moduleCore<'userProfile'> = {
  moduleName: 'userProfile',
  service(/* ctx */) {
    return {
      // async draftResourceIngestionOutcome({ eduResourceDraftId, userProfileIdSelect, ingestionOutcome }) {
      //   await ctx.write.setResourceIngestionStatus({
      //     userProfileIdSelect,
      //     eduResourceDraftId,
      //     resourceIngestionStatus: ingestionOutcome,
      //   })
      // },
    }
  },
  primary(ctx) {
    return {
      async session() {
        return {
          async moduleInfo() {
            const {
              configs: { profileInfoPrimaryMsgSchemaConfigs },
            } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'userProfile' })
            return { schemaConfigs: profileInfoPrimaryMsgSchemaConfigs }
          },
        } satisfies primary['session']
      },
      async authenticated() {
        const authenticatedUserSession = await assert_authorizeAuthenticatedCurrentUserSession({ ctx })
        const userProfileId = authenticatedUserSession.profile.id

        return {
          async createEduCollectionDraft({ eduCollectionMetaForm }) {
            const eduCollectionDraftId = generateAlphanumId()
            const eduCollectionDraft: eduCollectionDraft = {
              draftId: eduCollectionDraftId,
              created: ctx.now,
              lastEditDate: ctx.now,
              data: {
                description: eduCollectionMetaForm.description,
                title: eduCollectionMetaForm.title,
                items: [],
                image: NONE_ASSET,
              },
            }
            await ctx.write.createDraft({
              userProfileIdSelect: { by: 'userProfileId', userProfileId },
              draft: {
                type: 'eduCollection',
                data: eduCollectionDraft,
              },
            })

            return [true, { eduCollectionDraftId }]
          },
          async editEduCollectionDraft({ eduCollectionDraftId, eduCollectionMetaForm }) {
            await ctx.write.updateDraftMeta({
              userProfileIdSelect: { by: 'userProfileId', userProfileId },
              draftId: eduCollectionDraftId,
              lastEditDate: ctx.now,
              meta: {
                type: 'eduCollection',
                data: eduCollectionMetaForm,
              },
            })
          },
          async applyEduResourceDraftImage({ eduResourceDraftId, applyImageForm: { resourceImageForm: adoptAssetForm } }) {
            if (adoptAssetForm.type === 'external') {
              const asset: maybeAsset = { type: 'external', url: adoptAssetForm.url, credits: adoptAssetForm.credits }
              await ctx.write.updateDraftImage({
                userProfileIdSelect: { by: 'userProfileId', userProfileId },
                draftId: eduResourceDraftId,
                image: asset,
                lastEditDate: ctx.now,
                draftType: 'eduResource',
              })
              return
            }
            await ctx.write.useTempImageInDraft({
              draftType: 'eduResource',
              draftId: eduResourceDraftId,
              userProfileId,
              adoptAssetForm,
            })
          },
          async editEduResourceDraft({ eduResourceDraftId, eduResourceMetaForm }) {
            await ctx.write.updateDraftMeta({
              userProfileIdSelect: { by: 'userProfileId', userProfileId },
              draftId: eduResourceDraftId,
              lastEditDate: ctx.now,
              meta: {
                type: 'eduResource',
                data: eduResourceMetaForm,
              },
            })
          },
          async getEduCollectionDraft({ eduCollectionDraftId }) {
            const result = await ctx.mod.secondary.userProfile.query.getDraft({
              userProfileIdSelect: { by: 'userProfileId', userProfileId },
              draftType: 'eduCollection',
              draftId: eduCollectionDraftId,
            })

            return result
          },
          async getEduResourceDraft({ eduResourceDraftId }) {
            const result = await ctx.mod.secondary.userProfile.query.getDraft({
              userProfileIdSelect: { by: 'userProfileId', userProfileId },
              draftId: eduResourceDraftId,
              draftType: 'eduResource',
            })

            return result
          },
          async applyEduCollectionDraftImage({
            eduCollectionDraftId,
            applyImageForm: { resourceImageForm: adoptAssetForm },
          }) {
            if (adoptAssetForm.type === 'external') {
              const asset: maybeAsset = { type: 'external', url: adoptAssetForm.url, credits: adoptAssetForm.credits }
              await ctx.write.updateDraftImage({
                userProfileIdSelect: { by: 'userProfileId', userProfileId },
                draftId: eduCollectionDraftId,
                image: asset,
                lastEditDate: ctx.now,
                draftType: 'eduCollection',
              })
              return
            }
            await ctx.write.useTempImageInDraft({
              draftType: 'eduCollection',
              draftId: eduCollectionDraftId,
              userProfileId,
              adoptAssetForm,
            })
          },
          async createEduResourceDraft({ newResourceAsset }) {
            const eduResourceDraftId = generateAlphanumId()
            if (newResourceAsset.type === 'tempFile') {
              await ctx.write.useTempFileAsNewResourceDraftAsset({
                adoptAssetForm: newResourceAsset,
                eduResourceDraftId: eduResourceDraftId,
                userProfileId,
              })

              return [true, { eduResourceDraftId }]
            }
            const eduResourceDraft = createNewEduResourceDraftData({
              asset: newResourceAsset,
              created: ctx.now,
              eduResourceDraftId,
            })

            await ctx.write.createDraft({
              userProfileIdSelect: { by: 'userProfileId', userProfileId },
              draft: {
                type: 'eduResource',
                data: eduResourceDraft,
              },
            })
            return [true, { eduResourceDraftId }]
          },
          async useTempImageAsProfileImage({ useProfileImageForm: { type, adoptAssetForm } }) {
            if (adoptAssetForm.type === 'external') {
              const asset: maybeAsset = { type: 'external', url: adoptAssetForm.url, credits: adoptAssetForm.credits }
              await ctx.write.updateProfileImage({
                userProfileIdSelect: { by: 'userProfileId', userProfileId },
                lastEditDate: ctx.now,
                type,
                image: asset,
              })
              return
            }
            await ctx.write.useTempImageInProfile({
              type,
              userProfileId,
              adoptAssetForm,
            })
          },
          async getMyUserRecords() {
            const [myUserProfileFound, userProfileResult] = await fetchMyUserProfile()

            assertWithError4xx(myUserProfileFound, 'Not Found', {
              message: `seemingly authenticated session, but couldn't find userProfileRecord for userProfileId: ${userProfileId}`,
              authenticatedUserSession,
            })

            const userAccontRecord = await ctx.forward.userAccount.authenticated.getMyUserAccountRecord()
            return {
              userProfileRecord: omit(userProfileResult.userProfileRecord, 'userAccount'),
              userAccountRecord: omit(userAccontRecord, 'displayName'),
            }
          },
          async editProfileInfoMeta({ profileInfoMeta: partialProfileInfoMeta }) {
            await ctx.write.updateProfileInfoMeta({
              userProfileIdSelect: { by: 'userProfileId', userProfileId },
              profileInfoMeta: partialProfileInfoMeta,
              lastEditDate: ctx.now,
            })
            return
          },
        } satisfies primary['authenticated']

        function fetchMyUserProfile() {
          return ctx.mod.secondary.userProfile.query.getUserProfile({
            by: 'userProfileId',
            userProfileId,
          })
        }
      },
      // async admin() {
      //   /* const adminUserSession =  */ await assert_authorizeCurrentUserSessionWithRole({ ctx, role: 'admin' }).then(
      //     async authenticatedAdminUser => {
      //       return authenticatedAdminUser
      //     },
      //   )

      //   return {
      //     async byId(get) {
      //       const [found, userProfileResult] = await ctx.mod.secondary.userProfile.query.getUserProfile({ ...get })

      //       if (!found) {
      //         return [false, { reason: 'notFound' }]
      //       }
      //       return [true, { userProfileRecord: userProfileResult.userProfileRecord }]
      //     },
      //   } satisfies primary['admin']
      // },
    }
  },
  watch(ctx) {
    return {
      enqueue: {
        secondary: {
          resourceIngestion: {
            write: {
              async ingestResource({ ingestionContext }) {
                if (ingestionContext.type !== 'eduResourceDraft') {
                  return
                }

                await ctx.write.updateDraftResourceAssetProcessStatus({
                  userProfileIdSelect: ingestionContext.userProfileIdSelect,
                  eduResourceDraftId: ingestionContext.eduResourceDraftId,
                  processType: 'ingestion',
                  processStatus: {
                    status: 'awaiting',
                    engageDate: new Date().toISOString(),
                  },
                  condition: {
                    status: 'neverEngaged',
                  },
                })
              },
            },
          },
        },
      },
      result: {
        secondary: {
          resourceIngestion: {
            write: {
              async ingestResource([{ eduResourceIngestionOutcome }, payload]) {
                if (payload.ingestionContext.type !== 'eduResourceDraft') {
                  return
                }
                const [found, draft] = await ctx.mod.secondary.userProfile.query.getDraft({
                  draftId: payload.ingestionContext.eduResourceDraftId,
                  draftType: 'eduResource',
                  userProfileIdSelect: payload.ingestionContext.userProfileIdSelect,
                })
                if (!found || draft.assetProcessStatus.ingestion.status !== 'awaiting') {
                  return
                }

                await ctx.write.updateDraftResourceAssetProcessStatus({
                  userProfileIdSelect: payload.ingestionContext.userProfileIdSelect,
                  eduResourceDraftId: payload.ingestionContext.eduResourceDraftId,
                  processType: 'ingestion',
                  processStatus: {
                    ...draft.assetProcessStatus.ingestion,
                    status: 'finished',
                    finishDate: new Date().toISOString(),
                    outcome: eduResourceIngestionOutcome,
                  },
                  condition: {
                    status: draft.assetProcessStatus.ingestion.status,
                  },
                })
              },
            },
          },
          userProfile: {
            write: {
              async useTempFileAsNewResourceDraftAsset([
                adoptAssetResult,
                { eduResourceDraftId: resourceDraftId, userProfileId },
              ]) {
                if (adoptAssetResult.status === 'error') {
                  // ctx.log.warn('useTempFileAsNewResourceDraftAsset: adoptAssetResult error', adoptAssetResult)
                  return
                }
                const eduResourceDraftData = createNewEduResourceDraftData({
                  asset: adoptAssetResult.asset,
                  created: ctx.now,
                  eduResourceDraftId: resourceDraftId,
                })

                await ctx.write.createDraft({
                  userProfileIdSelect: { by: 'userProfileId', userProfileId },
                  draft: {
                    type: 'eduResource',
                    data: eduResourceDraftData,
                  },
                })
              },
              async useTempImageInProfile([adoptAssetResult, { userProfileId: id, type }]) {
                if (adoptAssetResult.status === 'error') {
                  // ctx.log.warn('useTempImageInProfile: adoptAssetResult error', adoptAssetResult)
                  return
                }
                const asset = adoptAssetResult.asset
                await ctx.write.updateProfileImage({
                  userProfileIdSelect: { by: 'userProfileId', userProfileId: id },
                  lastEditDate: ctx.now,
                  type,
                  image: asset,
                })
              },
              async useTempImageInDraft([adoptAssetResult, { userProfileId: id, draftId, draftType }]) {
                if (adoptAssetResult.status === 'error') {
                  return
                }
                const asset = adoptAssetResult.asset
                await ctx.write.updateDraftImage({
                  userProfileIdSelect: { by: 'userProfileId', userProfileId: id },
                  draftId,
                  image: asset,
                  lastEditDate: ctx.now,
                  draftType,
                })
              },
            },
          },
          userAccount: {
            write: {
              //REVIEW - this userAccount should emit an event and catch it here in userprofile
              async saveNewUser([[created], { newUser }]) {
                if (!created) {
                  return
                }
                await ctx.write.createUserProfile({
                  userProfileRecord: createNewUserProfileData({ newUser }),
                })
              },

              async setUserRoles([[newRolesSet, result], { userAccountId }]) {
                if (!newRolesSet) {
                  return
                }
                const [done, updateResult] = await ctx.sync.userAccountExcerpt({
                  userAccountExcerpt: { id: userAccountId, roles: result.newRoles },
                })
                if (!done) {
                  ctx.log.critical('could not update user roles', updateResult)
                }
              },
            },
          },
        },
      },
    }
  },
}
