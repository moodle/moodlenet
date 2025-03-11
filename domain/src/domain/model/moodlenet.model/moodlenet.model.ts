/* eslint-disable @typescript-eslint/no-namespace */
import { date_time_string, int } from '@moodle/lib-types'
import { cursorList } from '../../../types'
import { eduCollection, eduResource } from '../education.model'
import { userId, userProfile } from '../userAccount.model'
import { moodlenetConfigs, moodlenetSchemas } from './types'
import { Option } from 'fp-ts/Option'
const MODEL_NAME = 'moodlenet'

declare global {
  namespace moo {
    interface Models {
      [MODEL_NAME]: moodlenet
    }
    namespace Models {
      namespace statics {
        interface Schemas {
          [MODEL_NAME]: moodlenetSchemas
        }
        interface Configs {
          [MODEL_NAME]: moodlenetConfigs
        }
      }
    }
  }
}
type published<t> = {
  publishedDate: date_time_string
  data: t
}
export type moodlenetContributorRecord = {
  userId: string
  points: int
}
export type moodlenetContributorView = moodlenetContributorRecord & {
  userProfile: userProfile
  eduResource: cursorList<published<eduResource>>
  eduCollection: cursorList<published<eduCollection>>
}

export type moodlenet = moo.model<MoodlenetModel>

// type contentSort = 'popularity' | 'latest' | 'relevence'

export type MoodlenetModel = {
  contributor: {
    create: moo.model.op.set.create<moodlenetContributorRecord>
    query: moo.model.op.set.find<moodlenetContributorView, never /* , contentSort */>
    userId: Record<
      userId,
      {
        getData: moo.model.op.atom.get<Option<moodlenetContributorView>>
      }
    >
  }
  contributions: {
    eduResource: moo.model.op.set<published<eduResource>, resourceCategoryFilter /* , contentSort */>
    eduCollection: moo.model.op.set<published<eduCollection>, baseFilters /* , contentSort */>
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
