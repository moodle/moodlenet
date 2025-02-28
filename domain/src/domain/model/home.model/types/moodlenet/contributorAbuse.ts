import { userReportItem } from '../moderation'

type contributorAbuseType = string //TODO: type:desc map in moodlenet Configs?
export type contributorAbuseForm = {
  type: contributorAbuseType
  comment: string | undefined
}

export type contributorAbuseItem = userReportItem<contributorAbuseForm>
