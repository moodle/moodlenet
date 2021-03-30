import { NodeAssertion } from '@moodlenet/common/lib/content-graph'
import { aqlstr } from '../../../../../../../lib/helpers/arango'
import { getSessionExecutionContext } from '../../../../../../types'
import { AssertionArg } from './lib'

type NodeAssertionMap = {
  [a in NodeAssertion]: (_: AssertionArg) => string
}
export const nodeAssertionMap: NodeAssertionMap = {
  ExecutorCreatedThisNode: ({ ctx, thisNodeVar }) => {
    const sessionCtx = getSessionExecutionContext(ctx)
    if (!(sessionCtx && thisNodeVar)) {
      return `(false /*ExecutorCreatedThisNode thisNodeVar:${thisNodeVar}*/)`
    }
    return `${thisNodeVar}._meta.creator._id == ${aqlstr(sessionCtx.profileId)}`
  },
  ThisNodeIsExecutorProfile: ({ ctx, thisNodeVar }) => {
    const sessionCtx = getSessionExecutionContext(ctx)
    if (!(sessionCtx && thisNodeVar)) {
      return `(false /*ThisNodeIsExecutorProfile thisNodeVar:${thisNodeVar}*/)`
    }
    return `${thisNodeVar}._id == ${aqlstr(sessionCtx.profileId)}`
  },
}
