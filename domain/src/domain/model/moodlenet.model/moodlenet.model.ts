/* eslint-disable @typescript-eslint/no-namespace */
import { date_time_string, int } from '@moodle/lib-types'
import { cursorList } from '../../../types'
import { eduCollection, eduResource } from '../education.model'
import { userProfile } from '../userAccount.model'
import { moodlenetConfigs } from './types'
declare global {
  namespace moo {
    interface Models {
      moodlenet: moodlenet
    }
  }
}
type published<t> = {
  publishedDate: date_time_string
  data: t
}
export type moodlenetContributorSpace = {
  userId: string
  points: int
}
export type moodlenetContributorView = moodlenetContributorSpace & {
  userProfile: userProfile
  eduResource: cursorList<published<eduResource>>
  eduCollection: cursorList<published<eduCollection>>
}

export type moodlenet = moo.model<MoodlenetModel>

type contentSort = 'popularity' | 'latest' | 'relevence'

export type MoodlenetModel = {
  [moo.tags.configs]: moodlenetConfigs
  contributor: {
    create: moo.model.op.set.create<moodlenetContributorSpace>
    query: moo.model.op.set.find<moodlenetContributorView, never, contentSort>
  }
  contributions: {
    eduResource: moo.model.op.set<published<eduResource>, resourceCategoryFilter, contentSort>
    eduCollection: moo.model.op.set<published<eduCollection>, baseFilters, contentSort>
  }
}

type baseFilters = { userId: string; textSearch: string }
type resourceCategoryFilter = baseFilters & {
  iscedField: string
  iscedLevel: string
  bloomLearningOutcomes: string
  type: string
  language: string
  license: string
}
