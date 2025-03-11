/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/no-namespace */
import { deep_partial, i_nat, int } from '@moodle/lib-types'
import { Option } from 'fp-ts/Option'
import { contributorAbuseItem } from './types/moodlenet'
const MODEL_NAME = 'moderation'

declare global {
  namespace moo {
    interface Models {
      [MODEL_NAME]: moderation
    }
  }
}
interface Reports {
  moodlenet: { asContributor: contributorAbuseItem }
}

export type userModerationSpace = {
  userId: string
  reports: {
    receivedAmount: receivedAmounts
  }
}
type receivedAmounts = {
  [context in keyof Reports]: {
    [type in keyof Reports[context]]: i_nat
  }
}

export type moderation = moo.model<moderationModel>
type deltaAmounts = {
  [context in keyof Reports]: {
    [type in keyof Reports[context]]: int
  }
}
export type moderationModel = {
  user: {
    create: moo.model.op<['sync', userModerationSpace, void]>
    get: moo.model.op<['query', { userId: string }, Option<userModerationSpace>]>
  }
  reports: {
    received: {
      delta: moo.model.op<['sync', { on: deep_partial<deltaAmounts> }, { deltaAmounts: deltaAmounts }]>
      get: moo.model.op<['query', void, { receivedAmounts: receivedAmounts }]>
    }
  }
}
