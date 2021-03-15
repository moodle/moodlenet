import { Acks } from '../../../../../../lib/domain/misc'
import { LookupSubscriber } from '../../../../../../lib/domain/sub'
import { updateNodeEdgeCounters } from '../functions/updateNode-EdgeCounters'
import { MoodleNetArangoContentGraphSubDomain } from '../MoodleNetArangoContentGraphSubDomain'
import { Persistence } from '../types'

export const statsMaintainEdgeCounters = ({
  persistence,
}: {
  persistence: Persistence
}): LookupSubscriber<MoodleNetArangoContentGraphSubDomain, 'ContentGraph.Stats.MaintainEdgeCounters'> => async ({
  edge,
}) => {
  await updateNodeEdgeCounters({ edgeId: edge._id, persistence })
  return Acks.Done
}
