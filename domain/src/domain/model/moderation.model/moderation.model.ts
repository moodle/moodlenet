/* eslint-disable @typescript-eslint/no-namespace */
import { d_t_u, deep_partial, i_nat, int } from '@moodle/lib-types'
import { contributorAbuseItem } from './types/moodlenet'
declare global {
  namespace moo {
    interface Models {
      moderation: moderation
    }
  }
}
interface Reports {
  moodlenet: { asContributor: contributorAbuseItem }
}

type receivedAmounts = {
  [context in keyof Reports]: {
    [type in keyof Reports[context]]: i_nat
  }
}
type deltaAmounts = {
  [context in keyof Reports]: {
    [type in keyof Reports[context]]: int
  }
}

export type moderationUserSpace = {
  userId: string
  reports: {
    receivedAmount: receivedAmounts
  }
}

export type moderation = moo.model<moderationModel>

export type moderationModel = {
  [moo.tags.configs]: never
  userModeration: Pick<moo.model.op.set<moderationUserSpace, d_t_u<{ userId: string }>, never>, 'create' | 'find'>
  reports: {
    received: {
      delta: moo.model.op<['sync', { on: deep_partial<deltaAmounts> }, { deltaAmounts: deltaAmounts }]>
      get: moo.model.op<['query', { on: deep_partial<deltaAmounts> }, { deltaAmounts: deltaAmounts }]>
    }
  }
}

