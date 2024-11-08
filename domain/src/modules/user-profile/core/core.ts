import { omit } from 'lodash'
import UserProfileDomain, { eduCollectionDraft } from '..'
import { assertWithErrorXxx, moduleCore } from '../../../types'
import {
  assert_authorizeAuthenticatedCurrentUserSession,
  assert_authorizeCurrentUserSessionWithRole,
} from '../../user-account/lib'
import { createNewUserProfileData } from './lib/new-user-profile'
import { _void, date_time_string } from '@moodle/lib-types'
import { generateNanoId } from '@moodle/lib-id-gen'
import { NONE_ASSET } from '../../storage'

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
            const adoptAssetResponse = await ctx.write.useTempImageInDraft({
              type: 'eduCollection',
              draftId: eduCollectionDraftId,
              userProfileId,
              adoptingAsset: adoptAssetForm.adoptingAsset,
            })
            return { adoptAssetResponse, userProfileId }
          },
          async useTempImageAsProfileImage({ useProfileImageForm: { as, adoptAssetForm } }) {
            const { userProfileRecord } = authenticatedUserSession
            const adoptAssetResponse = await ctx.write.useTempImageInProfile({
              as,
              userProfileId: userProfileRecord.id,
              adoptingAsset: adoptAssetForm.adoptingAsset,
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
              if (adoptAssetResponse.response.status === 'error') {
                return
              }
              const asset = adoptAssetResponse.response.asset
              await ctx.write.updatePartialProfileInfo({
                userProfileId: id,
                partialProfileInfo: as === 'avatar' ? { avatar: asset } : as === 'background' ? { background: asset } : {},
              })
            },
            async useTempImageInDraft([adoptAssetResponse, { userProfileId: id, draftId, type }]) {
              if (adoptAssetResponse.response.status === 'error') {
                return
              }
              const asset = adoptAssetResponse.response.asset
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
