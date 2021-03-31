import { Acks } from '../../../../../../lib/domain/misc'
import { LookupSubscriber } from '../../../../../../lib/domain/sub'
import { updateNodeEdgeCounters } from '../functions/updateNode-EdgeCounters'
import { MoodleNetArangoContentGraphSubDomain } from '../MoodleNetArangoContentGraphSubDomain'
import { Persistence } from '../types'

export const statsMaintainEdgeCountersOnCreate = ({
  persistence,
}: {
  persistence: Persistence
}): LookupSubscriber<
  MoodleNetArangoContentGraphSubDomain,
  'ContentGraph.Stats.MaintainEdgeCounters.Created'
> => async ({ edge }) => {
  await updateNodeEdgeCounters({ edgeId: edge._id, persistence, del: false })
  return Acks.Done
}

export const statsMaintainEdgeCountersOnDelete = ({
  persistence,
}: {
  persistence: Persistence
}): LookupSubscriber<
  MoodleNetArangoContentGraphSubDomain,
  'ContentGraph.Stats.MaintainEdgeCounters.Deleted'
> => async ({ edge }) => {
  await updateNodeEdgeCounters({ edgeId: edge._id, persistence, del: true })
  return Acks.Done
}
