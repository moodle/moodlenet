import { emit } from '../../../../../../lib/domain/amqp/emit'
import { mergeFlow } from '../../../../../../lib/domain/flow'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { createEdge } from '../functions/createEdge'
import { MoodleNetArangoContentGraphSubDomain } from '../MoodleNetArangoContentGraphSubDomain'
import { Persistence } from '../types'

export const createEdgeWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoContentGraphSubDomain, 'ContentGraph.Edge.Create'> => async ({
  ctx,
  data,
  edgeType,
  from,
  to,
  key,
}) => {
  const mEdge = await createEdge({ ctx, data, edgeType, from, persistence, to, key })
  if (typeof mEdge === 'string') {
    return mEdge === 'no assertions found' ? 'UnexpectedInput' : 'NotAuthorized'
  }
  if ('CreateEdgeAssertionsFailed' in mEdge) {
    return 'AssertionFailed'
  }
  // console.log(`emit create edge`, mEdge._id)

  emit<MoodleNetArangoContentGraphSubDomain>()(
    'ContentGraph.Edge.Created',
    { edge: mEdge },
    mergeFlow(ctx.flow, [edgeType]),
  )

  return mEdge
}
