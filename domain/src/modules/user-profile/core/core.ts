import { generateNanoId } from '@moodle/lib-id-gen'
import { _void } from '@moodle/lib-types'
import { omit } from 'lodash'
import UserProfileDomain, { eduCollectionDraft } from '..'
import { assertWithErrorXxx, moduleCore } from '../../../types'
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
            const eduCollectionDraftId = generateNanoId()
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
            const [done] = await ctx.write.createDraft({
              userProfileIdSelect: { by: 'userProfileId', userProfileId },
              draft: {
                type: 'eduCollection',
                data: eduCollectionDraft,
              },
            })
            if (!done) {
              return [false, _void]
            }

            return [true, { eduCollectionDraftId }]
          },
          async editEduCollectionDraft({ eduCollectionDraftId, eduCollectionMetaForm }) {
            const [done] = await ctx.write.updateDraftMeta({
              userProfileIdSelect: { by: 'userProfileId', userProfileId },
              draftId: eduCollectionDraftId,
              lastEditDate: ctx.now,
              meta: {
                type: 'eduCollection',
                data: eduCollectionMetaForm,
              },
            })
            return [done, _void]
          },
          async applyEduResourceDraftImage({ eduResourceDraftId, applyImageForm: { resourceImageForm: adoptAssetForm } }) {
            if (adoptAssetForm.type === 'external') {
              const asset: maybeAsset = { type: 'external', url: adoptAssetForm.url, credits: adoptAssetForm.credits }
              const [done /* , result */] = await ctx.write.updateDraftImage({
                userProfileIdSelect: { by: 'userProfileId', userProfileId },
                draftId: eduResourceDraftId,
                image: asset,
                lastEditDate: ctx.now,
                draftType: 'eduResource',
              })
              return { userProfileId, adoptAssetResult: done ? { status: 'done', asset } : { status: 'error' } }
            }
            const adoptAssetResult = await ctx.write.useTempImageInDraft({
              draftType: 'eduResource',
              draftId: eduResourceDraftId,
              userProfileId,
              adoptAssetForm,
            })
            return { adoptAssetResult, userProfileId }
          },
          async editEduResourceDraft({ eduResourceDraftId, eduResourceMetaForm }) {
            const [done] = await ctx.write.updateDraftMeta({
              userProfileIdSelect: { by: 'userProfileId', userProfileId },
              draftId: eduResourceDraftId,
              lastEditDate: ctx.now,
              meta: {
                type: 'eduResource',
                data: eduResourceMetaForm,
              },
            })
            return [done, _void]
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
              const [done /* , result */] = await ctx.write.updateDraftImage({
                userProfileIdSelect: { by: 'userProfileId', userProfileId },
                draftId: eduCollectionDraftId,
                image: asset,
                lastEditDate: ctx.now,
                draftType: 'eduCollection',
              })
              return { userProfileId, adoptAssetResult: done ? { status: 'done', asset } : { status: 'error' } }
            }
            const adoptAssetResult = await ctx.write.useTempImageInDraft({
              draftType: 'eduCollection',
              draftId: eduCollectionDraftId,
              userProfileId,
              adoptAssetForm,
            })
            return { adoptAssetResult, userProfileId }
          },
          async createEduResourceDraft({ newResourceAsset }) {
            const eduResourceDraftId = generateNanoId()
            if (newResourceAsset.type === 'tempFile') {
              const result = await ctx.write.useTempFileAsNewResourceDraftAsset({
                adoptAssetForm: newResourceAsset,
                eduResourceDraftId: eduResourceDraftId,
                userProfileId,
              })

              return result.status === 'error' ? [false, _void] : [true, { eduResourceDraftId }]
            }
            const eduResourceDraft = createNewEduResourceDraftData({
              asset: newResourceAsset,
              created: ctx.now,
              eduResourceDraftId,
            })

            const [done] = await ctx.write.createDraft({
              userProfileIdSelect: { by: 'userProfileId', userProfileId },
              draft: {
                type: 'eduResource',
                data: eduResourceDraft,
              },
            })
            return done ? [true, { eduResourceDraftId }] : [false, _void]
          },
          async useTempImageAsProfileImage({ useProfileImageForm: { type, adoptAssetForm } }) {
            if (adoptAssetForm.type === 'external') {
              const asset: maybeAsset = { type: 'external', url: adoptAssetForm.url, credits: adoptAssetForm.credits }
              const [done /* , result */] = await ctx.write.updateProfileImage({
                userProfileIdSelect: { by: 'userProfileId', userProfileId },
                lastEditDate: ctx.now,
                type,
                image: asset,
              })
              return { userProfileId, adoptAssetResult: done ? { status: 'done', asset } : { status: 'error' } }
            }
            const adoptAssetResult = await ctx.write.useTempImageInProfile({
              type,
              userProfileId,
              adoptAssetForm,
            })
            return { adoptAssetResult, userProfileId }
          },
          async getMyUserRecords() {
            const [myUserProfileFound, userProfileResult] = await fetchMyUserProfile()

            assertWithErrorXxx(myUserProfileFound, 'Not Found', {
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
            const [done] = await ctx.write.updateProfileInfoMeta({
              userProfileIdSelect: { by: 'userProfileId', userProfileId },
              profileInfoMeta: partialProfileInfoMeta,
              lastEditDate: ctx.now,
            })
            if (!done) {
              return [false, { reason: 'unknown' }]
            }
            return [done, { userProfileId }]
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
                  condition:{
                    status: 'neverEngaged',
                  }
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
                  // ctx.log('warn', 'useTempFileAsNewResourceDraftAsset: adoptAssetResult error', adoptAssetResult)
                  return
                }
                const eduResourceDraftData = createNewEduResourceDraftData({
                  asset: adoptAssetResult.asset,
                  created: ctx.now,
                  eduResourceDraftId: resourceDraftId,
                })

                const [done, createDraftResult] = await ctx.write.createDraft({
                  userProfileIdSelect: { by: 'userProfileId', userProfileId },
                  draft: {
                    type: 'eduResource',
                    data: eduResourceDraftData,
                  },
                })

                if (!done) {
                  ctx.log('warn', 'could not create resource draft', createDraftResult)
                  // TODO: delete resource asset file
                }
              },
              async useTempImageInProfile([adoptAssetResult, { userProfileId: id, type }]) {
                if (adoptAssetResult.status === 'error') {
                  // ctx.log('warn', 'useTempImageInProfile: adoptAssetResult error', adoptAssetResult)
                  return
                }
                const asset = adoptAssetResult.asset
                const [done, updateResult] = await ctx.write.updateProfileImage({
                  userProfileIdSelect: { by: 'userProfileId', userProfileId: id },
                  lastEditDate: ctx.now,
                  type,
                  image: asset,
                })
                if (!done) {
                  ctx.log('warn', 'could not update profile image', updateResult)
                  // TODO: delete resource asset fil. ( and set image to none ? )
                }
              },
              async useTempImageInDraft([adoptAssetResult, { userProfileId: id, draftId, draftType }]) {
                if (adoptAssetResult.status === 'error') {
                  return
                }
                const asset = adoptAssetResult.asset
                const [done, updateResult] = await ctx.write.updateDraftImage({
                  userProfileIdSelect: { by: 'userProfileId', userProfileId: id },
                  draftId,
                  image: asset,
                  lastEditDate: ctx.now,
                  draftType,
                })
                if (!done) {
                  ctx.log('warn', 'could not update draft image', updateResult)
                  // TODO: delete resource asset file. ( and set image to none ? )
                }
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
                const [done, createResult] = await ctx.write.createUserProfile({
                  userProfileRecord: createNewUserProfileData({ newUser }),
                })
                if (!done) {
                  ctx.log('critical', 'could not create user profile', createResult)
                }
              },

              async setUserRoles([[newRolesSet, result], { userAccountId }]) {
                if (!newRolesSet) {
                  return
                }
                const [done, updateResult] = await ctx.sync.userAccountExcerpt({
                  userAccountExcerpt: { id: userAccountId, roles: result.newRoles },
                })
                if (!done) {
                  ctx.log('critical', 'could not update user roles', updateResult)
                }
              },
            },
          },
        },
      },
    }
  },
}
