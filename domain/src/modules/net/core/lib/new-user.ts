import { date_time_string, non_negative_integer_schema } from '@moodle/lib-types'
import { baseContext } from '../../../../types'
import { userProfileMoodlenetData } from '../../types'
import { userAccountMoodlenetData } from '../../types/moderation'

export async function newUserAccountMoodlenetData(): Promise<userAccountMoodlenetData> {
  const userAccountMoodlenetData: userAccountMoodlenetData = {
    moderation: { reports: { amount: non_negative_integer_schema.parse(0), items: [] } },
  }
  return userAccountMoodlenetData
}

export async function newUserProfileMoodlenetData({ ctx }: { ctx: baseContext }): Promise<userProfileMoodlenetData> {
  const {
    configs: {
      pointSystem: { welcomePoints },
    },
  } = await ctx.mod.env.query.modConfigs({ mod: 'net' })
  const userProfileMoodlenetData: userProfileMoodlenetData = {
    featuredContent: { bookmarked: [], following: [], liked: [] },
    points: { amount: welcomePoints },
    preferences: { useMyInterestsAsDefaultFilters: true },
    published: { contributions: [] },
    suggestedContent: {
      listsCreationDate: date_time_string('now'),
      userProfiles: [],
      eduResourceCollections: [],
      eduResources: [],
    },
  }
  return userProfileMoodlenetData
}
