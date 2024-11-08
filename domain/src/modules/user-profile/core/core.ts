import { omit } from 'lodash'
import UserProfileDomain, { eduCollectionDraft } from '..'
import { assertWithErrorXxx, moduleCore } from '../../../types'
import {
  assert_authorizeAuthenticatedCurrentUserSession,
  assert_authorizeCurrentUserSessionWithRole,
} from '../../user-account/lib'
import { createNewUserProfileData } from './lib/new-user-profile'
import { _void, date_time_string, unreachable_never } from '@moodle/lib-types'
import { generateNanoId } from '@moodle/lib-id-gen'
import { asset, NONE_ASSET } from '../../storage'

type userProfilePrimary = UserProfileDomain['primary']['userProfile']
export const user_profile_core: moduleCore<'userProfile'> = {
  modName: 'userProfile',
  service() {
    return
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
        }
      },
      async authenticated() {
        const authenticatedUserSession = await assert_authorizeAuthenticatedCurrentUserSession({ ctx }).then(
          async authenticatedUser => {
            const userProfileId = authenticatedUser.profile.id
            const [found, userProfileResult] = await ctx.mod.secondary.userProfile.query.getUserProfile({
              by: 'userProfileId',
              userProfileId,
            })
            assertWithErrorXxx(found, 'Not Found', 'authenticated userProfileRecord not found')
            return userProfileResult
          },
        )
        const userProfileId = authenticatedUserSession.userProfileRecord.id
        const primaries: userProfilePrimary['authenticated'] = {
          async createEduCollectionDraft({ eduCollectionMetaForm }) {
            const eduCollectionDraftId = await generateNanoId()
            const now = date_time_string('now')
            const eduCollectionDraft: eduCollectionDraft = {
              created: now,
              lastUpdateDate: now,
              data: {
                description: eduCollectionMetaForm.description,
                title: eduCollectionMetaForm.title,
                items: [],
                image: NONE_ASSET,
              },
            }
            const [done] = await ctx.write.createEduCollectionDraft({
              userProfileId,
              eduCollectionDraft,
              eduCollectionDraftId,
            })
            if (!done) {
              return [false, _void]
            }

            return [true, { eduCollectionDraftId }]
          },
          async editEduCollectionDraft({ eduCollectionDraftId, eduCollectionMetaForm }) {
            const [done] = await ctx.write.updateEduCollectionDraft({
              userProfileId,
              eduCollectionDraftId,
              partialEduCollectionDraft: {
                lastUpdateDate: date_time_string('now'),
                data: eduCollectionMetaForm,
              },
            })
            return [done, _void]
          },
          async getEduCollectionDraft({ eduCollectionDraftId }) {
            const response = await ctx.mod.secondary.userProfile.query.getEduCollectionDraft({
              userProfileId,
              eduCollectionDraftId,
            })

            return response
          },
          async applyEduCollectionDraftImage({ eduCollectionDraftId, applyImageForm: { adoptAssetForm } }) {
            const {
              userProfileRecord: { id: userProfileId },
            } = authenticatedUserSession
            if (adoptAssetForm.type === 'external') {
              const asset: asset = { type: 'external', url: adoptAssetForm.url, credits: adoptAssetForm.credits }
              const [done /* , result */] = await ctx.write.updateEduCollectionDraft({
                userProfileId,
                eduCollectionDraftId,
                partialEduCollectionDraft: {
                  data: { image: asset },
                },
              })
              return { userProfileId, adoptAssetResponse: done ? { status: 'done', asset } : { status: 'error' } }
            }
            const adoptAssetResponse = await ctx.write.useTempImageInDraft({
              type: 'eduCollection',
              draftId: eduCollectionDraftId,
              userProfileId,
              adoptAssetForm,
            })
            return { adoptAssetResponse, userProfileId }
          },
          async useTempImageAsProfileImage({ useProfileImageForm: { as, adoptAssetForm } }) {
            const { userProfileRecord } = authenticatedUserSession
            if (adoptAssetForm.type === 'external') {
              const asset: asset = { type: 'external', url: adoptAssetForm.url, credits: adoptAssetForm.credits }
              // FIXME:
              // FIXME:
              // FIXME:
              // FIXME:
              // FIXME:
              // FIXME: updatePartialProfileInfo is not good to update atomic objects
              // FIXME:   e.g. setting an asset { type: 'none' } over a local asset,
              // FIXME:   will update the { type } property only, keeping all the rest
              // FIXME:   investigate if it makes sense to get rid of partial-update-services
              // FIXME:   or, anyaway, find a way to properly and safely update for every scenario
              const [done /* , result */] = await ctx.write.updatePartialProfileInfo({
                userProfileId,
                partialProfileInfo:
                  as === 'avatar' ? { avatar: asset } : as === 'background' ? { background: asset } : unreachable_never(as),
              })
              return { userProfileId, adoptAssetResponse: done ? { status: 'done', asset } : { status: 'error' } }
            }
            const adoptAssetResponse = await ctx.write.useTempImageInProfile({
              as,
              userProfileId: userProfileRecord.id,
              adoptAssetForm,
            })
            // await ctx.write.updatePartialProfileInfo({
            //   userProfileId: id,
            //   partialProfileInfo: as === 'avatar' ? { avatar: asset } : as === 'background' ? { background: asset } : {},
            // })
            return { adoptAssetResponse, userProfileId }
          },
          async getMyUserRecords() {
            const { userProfileRecord } = authenticatedUserSession
            const userAccontRecord = await ctx.forward.userAccount.authenticated.getMyUserAccountRecord()
            return {
              userProfileRecord: omit(userProfileRecord, 'userAccount'),
              userAccountRecord: omit(userAccontRecord, 'displayName'),
            }
          },
          async editProfileInfoMeta({ partialProfileInfoMeta }) {
            const { userProfileRecord } = authenticatedUserSession
            const [done] = await ctx.write.updatePartialProfileInfo({
              userProfileId: userProfileRecord.id,
              partialProfileInfo: partialProfileInfoMeta,
            })
            if (!done) {
              return [false, { reason: 'unknown' }]
            }
            return [done, { userProfileId }]
          },
        }
        return primaries
      },
      async admin() {
        /* const adminUserSession =  */ await assert_authorizeCurrentUserSessionWithRole({ ctx, role: 'admin' }).then(
          async authenticatedAdminUser => {
            return authenticatedAdminUser
          },
        )

        return {
          async byId(get) {
            const [found, userProfileResult] = await ctx.mod.secondary.userProfile.query.getUserProfile({ ...get })

            if (!found) {
              return [false, { reason: 'notFound' }]
            }
            return [true, { userProfileRecord: userProfileResult.userProfileRecord }]
          },
        }
      },
    }
  },
  watch(ctx) {
    return {
      secondary: {
        userProfile: {
          write: {
            async useTempImageInProfile([adoptAssetResponse, { userProfileId: id, as }]) {
              if (adoptAssetResponse.status === 'error') {
                return
              }
              const asset = adoptAssetResponse.asset
              await ctx.write.updatePartialProfileInfo({
                userProfileId: id,
                partialProfileInfo:
                  as === 'avatar' ? { avatar: asset } : as === 'background' ? { background: asset } : unreachable_never(as),
              })
            },
            async useTempImageInDraft([adoptAssetResponse, { userProfileId: id, draftId, type }]) {
              if (adoptAssetResponse.status === 'error') {
                return
              }
              const asset = adoptAssetResponse.asset
              if (type === 'eduResource') {
                throw 'not implemented refactor updateEduCollectionDraft => updateMyDraft (type:eduResource|eduCollection)'
              }
              await ctx.write.updateEduCollectionDraft({
                userProfileId: id,
                eduCollectionDraftId: draftId,
                partialEduCollectionDraft: { data: { image: asset } },
              })
            },
          },
        },
        userAccount: {
          write: {
            //REVIEW - this userAccount should emit an event and catch it here  in userprofile
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
