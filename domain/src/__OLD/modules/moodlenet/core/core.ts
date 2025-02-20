import { generateAlphanumId } from '@moodle/lib-id-gen'
import { void_, i_nat } from '@moodle/lib-types'
import assert from 'assert'
import { omit } from 'lodash'
import { assertWithError4xx, moduleCore } from '../../../types'
import { assert_authorizeCurrentUserSessionWithRole, validate_currentUserSessionInfo } from '../../user-account/lib'

export const moodlenet_core: moduleCore<'moodlenet'> = {
  moduleName: 'moodlenet',
  service() {
    return
  },
  primary(ctx) {
    return {
      async session() {
        return {
          async getMyCurrentMoodlenetSessionData() {
            const currentSessionInfo = await validate_currentUserSessionInfo({ ctx })
            if (!currentSessionInfo.authenticated) {
              return { type: 'guest' }
            }

            const { userAccountRecord, userProfileRecord } = await ctx.forward.userProfile.authenticated.getMyUserRecords()
            const [foundContributorRecord, contributorRecordResult] = await ctx.mod.secondary.moodlenet.query.contributor({
              select: {
                by: 'userProfileId',
                userProfileId: userProfileRecord.id,
              },
              filter: { accessLevel: false },
            })
            assert(
              foundContributorRecord,
              `moodlenetContributorRecord notfound for authenticated userAccountRecord#${userAccountRecord.id}`,
            )
            assertWithError4xx(foundContributorRecord, 'Not Found', {
              message: `seemingly authenticated session, but couldn't find moodlenetContributorRecord for userProfileId: ${userProfileRecord.id}`,
              currentSessionInfo,
            })
            return {
              type: 'authenticated',
              userProfileRecord: omit(userProfileRecord, 'userAccount'),
              userAccountRecord: omit(userAccountRecord, 'displayName'),
              moodlenetContributorRecord: omit(contributorRecordResult.moodlenetContributorRecord, 'userProfile'),
            }
          },
          async moduleInfo() {
            const {
              configs: {
                siteInfo: info,
                pointSystem,
                moodlenetPrimaryMsgSchemaConfigs,
                eduPublishPrimaryMsgSchemaConfigOverrides,
              },
            } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'moodlenet' })
            return {
              info,
              schemaConfigs: moodlenetPrimaryMsgSchemaConfigs,
              pointSystem,
              eduPublishPrimaryMsgSchemaConfigOverrides,
            }
          },
        }
      },
      // async contributor() {
      //   return {
      //     async getLeaders({ amount = 20 }) {
      //       const { moodlenetContributorRecords } = await ctx.mod.secondary.moodlenet.query.contributors({
      //         range: [amount],
      //         sort: ['points', 'DESC'],
      //         // filters: [{ type: 'access', levels: ['public'] } default],
      //       })
      //       return { leaderContributors: moodlenetContributorRecords.map(mapContributorToMinimalInfo) }
      //     },
      //     async getById({ moodlenetContributorId }) {
      //       const moodlenetContributorAccessObject = await accessMoodlenetContributor({ ctx, id: moodlenetContributorId })
      //       return moodlenetContributorAccessObject
      //     },
      //   }
      // },
      async admin() {
        return {
          async updatePartialMoodlenetInfo({ partialInfo }) {
            assert_authorizeCurrentUserSessionWithRole({ ctx, role: 'admin' })
            const [done] = await ctx.mod.secondary.env.service.updatePartialConfigs({
              mod: 'moodlenet',
              partialConfigs: { siteInfo: partialInfo },
            })
            return [done, void_]
          },
          async contributor(select) {
            const result = await ctx.mod.secondary.moodlenet.query.contributor({ select, filter: { accessLevel: false } })
            return result
          },
        }
      },
    }
  },
  watch(ctx) {
    return {
      result: {
        secondary: {
          userAccount: {
            write: {
              async setUserRoles([[done], { roles, userAccountId }]) {
                if (!done) {
                  return
                }
                await ctx.write.updateMoodlenetContributorAccess({
                  select: { by: 'userAccountId', userAccountId },
                  access: roles.includes('contributor') ? 'public' : 'protected',
                })
              },
            },
          },
          userProfile: {
            write: {
              async updateProfileInfoMeta([[done], payload]) {
                if (!done) {
                  return
                }
                await ctx.write.updateMoodlenetContributorProfileInfoMeta({
                  select: payload.userProfileIdSelect,
                  profileInfoMeta: payload.profileInfoMeta,
                  lastEditDate: payload.lastEditDate,
                })
              },
              async updateProfileImage([[done], payload]) {
                if (!done) {
                  return
                }
                await ctx.write.updateMoodlenetContributorProfileInfoImage({
                  select: payload.userProfileIdSelect,
                  image: payload.image,
                  type: payload.type,
                  lastEditDate: payload.lastEditDate,
                })
              },
              async createUserProfile([[created], payload]) {
                if (!created) {
                  return
                }
                const { userProfileRecord } = payload
                const id = generateAlphanumId()
                const { configs } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'moodlenet' })
                await ctx.write.createMoodlenetContributor({
                  moodlenetContributorRecord: {
                    id,
                    access: userProfileRecord.userAccount.roles.includes('contributor') ? 'public' : 'protected',
                    contributions: { eduResources: [], eduResourcesCollections: [] },
                    linkedContent: {
                      bookmark: { eduCollections: [], eduResources: [] },
                      follow: { eduCollections: [], moodlenetContributors: [], iscedFields: [] },
                      like: { eduResources: [] },
                    },
                    preferences: { useMyInterestsAsDefaultFilters: false },
                    stats: {
                      points: configs.pointSystem.welcomePoints,
                      followersCount: 0 as i_nat,
                      followingCount: 0 as i_nat,
                      publishedResourcesCount: 0 as i_nat,
                      recalculatedDate: ctx.now,
                    },
                    suggestedContent: {
                      listCreationDate: ctx.now,
                      lists: {
                        eduCollections: [],
                        eduResources: [],
                        moodlenetContributors: [],
                      },
                    },
                    userProfile: {
                      id: userProfileRecord.id,
                      info: userProfileRecord.info,
                    },
                  },
                })
              },
            },
          },
        },
      },
    }
  },
}
