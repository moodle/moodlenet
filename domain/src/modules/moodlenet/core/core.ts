import { generateNanoId } from '@moodle/lib-id-gen'
import { _void, date_time_string, webSlug } from '@moodle/lib-types'
import assert from 'assert'
import { omit } from 'lodash'
import { moduleCore } from '../../../types'
import { assert_authorizeCurrentUserSessionWithRole, validate_currentUserSessionInfo } from '../../user-account/lib'
import { mapContributorToMinimalInfo } from './lib/contributor'
import { accessMoodlenetContributor } from './lib/primary-access'

export const moodlenet_core: moduleCore<'moodlenet'> = {
  modName: 'moodlenet',
  service() {
    return
  },
  primary(ctx) {
    return {
      session: {
        async getMySessionUserRecords() {
          const currentSessionInfo = await validate_currentUserSessionInfo({ ctx })
          if (!currentSessionInfo.authenticated) {
            return { type: 'guest' }
          }

          const { userAccountRecord, userProfileRecord } = await ctx.forward.userProfile.me.getMyUserRecords()
          const [foundContributorRecord, contributorRecordResult] = await ctx.mod.secondary.moodlenet.query.contributorById({
            id: userProfileRecord.id,
          })
          assert(foundContributorRecord, 'Contributor not found for authenticated user')
          return {
            type: 'authenticated',
            userProfileRecord: omit(userProfileRecord, 'userAccount'),
            userAccountRecord: omit(userAccountRecord, 'displayName'),
            moodlenetContributorRecord: omit(contributorRecordResult.moodlenetContributorRecord, 'userProfile'),
          }
        },
        async moduleInfo() {
          const {
            configs: { info, pointSystem, moodlenetPrimaryMsgSchemaConfigs: moodlenetPrimaryMsgSchemaConfigs },
          } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'moodlenet' })
          return {
            info,
            schemaConfigs: moodlenetPrimaryMsgSchemaConfigs,
            pointSystem,
          }
        },
      },
      contributor: {
        async getLeaders({ amount = 20 }) {
          const { moodlenetContributorRecords } = await ctx.mod.secondary.moodlenet.query.contributors({
            range: [amount],
            sort: ['points', 'DESC'],
            // filters: [{ type: 'access', levels: ['public'] } default],
          })
          return { leaderContributors: moodlenetContributorRecords.map(mapContributorToMinimalInfo) }
        },
        async getById({ moodlenetContributorId }) {
          const moodlenetContributorAccessObject = await accessMoodlenetContributor({ ctx, id: moodlenetContributorId })
          return moodlenetContributorAccessObject
        },
      },
      admin: {
        async updatePartialMoodlenetInfo({ partialInfo }) {
          assert_authorizeCurrentUserSessionWithRole({ ctx, role: 'admin' })
          const [done] = await ctx.mod.secondary.env.service.updatePartialConfigs({
            mod: 'moodlenet',
            partialConfigs: { info: partialInfo },
          })
          return [done, _void]
        },
      },
    }
  },
  watch(ctx) {
    return {
      secondary: {
        userProfile: {
          write: {
            async createUserProfile([[created], payload]) {
              if (!created) {
                return
              }
              const { userProfileRecord } = payload
              const id = await generateNanoId()
              const { configs } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'moodlenet' })
              await ctx.write.createMoodlenetContributor({
                id,
                access: { level: userProfileRecord.userAccount.roles.includes('contributor') ? 'public' : 'protected' },
                contributions: { eduResources: [], eduResourcesCollections: [] },
                slug: webSlug(userProfileRecord.info.displayName),
                linkedContent: {
                  bookmarked: { eduResourceCollections: [], eduResources: [] },
                  following: { eduResourceCollections: [], moodlenetContributors: [], iscedFields: [] },
                  likes: { eduResources: [] },
                },
                preferences: { useMyInterestsAsDefaultFilters: false },
                stats: { points: configs.pointSystem.welcomePoints },
                suggestedContent: {
                  listCreationDate: date_time_string('now'),
                  lists: {
                    eduResourceCollections: [],
                    eduResources: [],
                    moodlenetContributors: [],
                  },
                },
                userProfile: {
                  id: userProfileRecord.id,
                  info: userProfileRecord.info,
                },
              })
            },
          },
        },
      },
    }
  },
}
