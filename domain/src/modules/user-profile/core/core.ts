import { generateNanoId } from '@moodle/lib-id-gen'
import { _void } from '@moodle/lib-types'
import { omit } from 'lodash'
import UserProfileDomain, { eduCollectionDraft, eduResourceDraft } from '..'
import { assertWithErrorXxx, moduleCore } from '../../../types'
import { maybeAsset, NONE_ASSET } from '../../storage'
import { assert_authorizeAuthenticatedCurrentUserSession } from '../../user-account/lib'
import { createNewUserProfileData } from './lib/new-user-profile'

type primary = UserProfileDomain['primary']['userProfile']
export const user_profile_core: moduleCore<'userProfile'> = {
  modName: 'userProfile',
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
            const eduCollectionDraftId = await generateNanoId()
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
              return { userProfileId, adoptAssetResponse: done ? { status: 'done', asset } : { status: 'error' } }
            }
            const adoptAssetResponse = await ctx.write.useTempImageInDraft({
              draftType: 'eduResource',
              draftId: eduResourceDraftId,
              userProfileId,
              adoptAssetForm,
            })
            return { adoptAssetResponse, userProfileId }
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
            const response = await ctx.mod.secondary.userProfile.query.getDraft({
              userProfileIdSelect: { by: 'userProfileId', userProfileId },
              draftType: 'eduCollection',
              draftId: eduCollectionDraftId,
            })

            return response
          },
          async getEduResourceDraft({ eduResourceDraftId }) {
            const response = await ctx.mod.secondary.userProfile.query.getDraft({
              userProfileIdSelect: { by: 'userProfileId', userProfileId },
              draftId: eduResourceDraftId,
              draftType: 'eduResource',
            })

            return response
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
              return { userProfileId, adoptAssetResponse: done ? { status: 'done', asset } : { status: 'error' } }
            }
            const adoptAssetResponse = await ctx.write.useTempImageInDraft({
              draftType: 'eduCollection',
              draftId: eduCollectionDraftId,
              userProfileId,
              adoptAssetForm,
            })
            return { adoptAssetResponse, userProfileId }
          },
          async createEduResourceDraft({ newResourceAsset, eduResourceMeta }) {
            const eduResourceDraftId = await generateNanoId()
            const asset =
              newResourceAsset.type === 'external'
                ? newResourceAsset
                : await ctx.write
                    .useTempFileAsResourceDraftAsset({
                      adoptAssetForm: newResourceAsset,
                      resourceDraftId: eduResourceDraftId,
                      userProfileId,
                    })
                    .then(result =>
                      result.status === 'done'
                        ? result.asset
                        : ({ type: 'save asset error', message: result.message } as const),
                    )

            if (asset.type === 'save asset error') {
              return [false, _void /* , { reason: asset.message } */]
            }

            const eduResourceDraft: eduResourceDraft = {
              draftId: eduResourceDraftId,
              created: ctx.now,
              lastEditDate: ctx.now,
              data: {
                title: '',
                description: '',
                asset,
                assetProcess: {
                  aiAnalysis: { status: 'neverEnqueued' },
                  resourceIngestionStatus: { status: 'neverEnqueued' },
                },
                bloomLearningOutcomes: [],
                image: NONE_ASSET,
                iscedField: null,
                iscedLevel: null,
                language: null,
                license: null,
                type: null,
                publicationDate: null,
                ...eduResourceMeta,
              },
            }

            const [done /* , result */] = await ctx.write.createDraft({
              userProfileIdSelect: { by: 'userProfileId', userProfileId },
              draft: {
                type: 'eduResource',
                data: eduResourceDraft,
              },
            })

            if (!done) {
              return [false, _void /* , { reason: 'unknown' } */]
            }
            return [true, { eduResourceDraftId }]
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
              return { userProfileId, adoptAssetResponse: done ? { status: 'done', asset } : { status: 'error' } }
            }
            const adoptAssetResponse = await ctx.write.useTempImageInProfile({
              type,
              userProfileId,
              adoptAssetForm,
            })
            return { adoptAssetResponse, userProfileId }
          },
          async getMyUserRecords() {
            const [myUserProfileFound, userProfileResult] = await fetchMyUserProfile()

            assertWithErrorXxx(myUserProfileFound, 'Not Found', 'authenticated userProfileRecord not found')

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
      secondary: {
        userProfile: {
          write: {
            async useTempImageInProfile([adoptAssetResponse, { userProfileId: id, type }]) {
              if (adoptAssetResponse.status === 'error') {
                return
              }
              const asset = adoptAssetResponse.asset
              await ctx.write.updateProfileImage({
                userProfileIdSelect: { by: 'userProfileId', userProfileId: id },
                lastEditDate: ctx.now,
                type,
                image: asset,
              })
            },
            async useTempImageInDraft([adoptAssetResponse, { userProfileId: id, draftId, draftType }]) {
              if (adoptAssetResponse.status === 'error') {
                return
              }
              const asset = adoptAssetResponse.asset
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
            async saveNewUser([[created, resp], { newUser }]) {
              ctx.log('debug', 'user-profile watch saveNewUser', { created, resp, newUser })
              if (!created) {
                return
              }
              ctx.write.createUserProfile({ userProfileRecord: await createNewUserProfileData({ newUser }) })
            },

            async setUserRoles([[done, result], { userAccountId }]) {
              if (!done) {
                return
              }
              await ctx.sync.userAccountExcerpt({
                userAccountExcerpt: { id: userAccountId, roles: result.newRoles },
              })
            },
          },
        },
      },
    }
  },
}
