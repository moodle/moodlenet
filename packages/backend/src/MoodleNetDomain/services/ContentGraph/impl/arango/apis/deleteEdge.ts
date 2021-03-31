import { emit } from '../../../../../../lib/domain/amqp/emit'
import { mergeFlow } from '../../../../../../lib/domain/flow'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { deleteEdge } from '../functions/deleteEdge'
import { MoodleNetArangoContentGraphSubDomain } from '../MoodleNetArangoContentGraphSubDomain'
import { Persistence } from '../types'

export const deleteEdgeWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoContentGraphSubDomain, 'ContentGraph.Edge.Delete'> => async ({
  ctx,
  edgeId,
  edgeType,
}) => {
  const delEdgeResult = await deleteEdge({ ctx, edgeId, persistence })
  if (typeof delEdgeResult === 'string') {
    return delEdgeResult === 'no assertions found'
      ? 'UnexpectedInput'
      : delEdgeResult === 'edge not found'
      ? 'NotFound'
      : 'NotAuthorized'
  }

  if ('DeleteEdgeAssertionsFailed' in delEdgeResult) {
    return 'AssertionFailed'
  }
  console.log(`emit delete edge`, delEdgeResult._id)
  emit<MoodleNetArangoContentGraphSubDomain>()(
    'ContentGraph.Edge.Deleted',
    { edge: delEdgeResult },
    mergeFlow(ctx.flow, [edgeType]),
  )

  return delEdgeResult
}
