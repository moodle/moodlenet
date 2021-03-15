import { emit } from '../../../../../../lib/domain/amqp/emit'
import { mergeFlow } from '../../../../../../lib/domain/flow'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import * as GQL from '../../../ContentGraph.graphql.gen'
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
  const mEdge = await createEdge({ data, edgeType, from, persistence, to, key })
  if (!mEdge) {
    return GQL.CreateEdgeMutationErrorType.NotAllowed
  }

  emit<MoodleNetArangoContentGraphSubDomain>()(
    'ContentGraph.Edge.Created',
    { edge: mEdge },
    mergeFlow(ctx.flow, [edgeType]),
  )
  return mEdge
}
