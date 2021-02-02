import { MoodleNetExecutionAuth } from '../../../types'
import { ShallowByAt, ShallowMeta } from '../persistence/types'

export const createMeta = (auth: MoodleNetExecutionAuth): ShallowMeta => ({
  __typename: 'Meta',
  created: byAtNow(auth),
  lastUpdate: byAtNow(auth),
})

export const byAtNow = (auth: MoodleNetExecutionAuth): ShallowByAt => ({
  __typename: 'ByAt',
  at: new Date(),
  by: { _id: auth.userId },
})
