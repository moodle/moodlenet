import { emit } from '../../../../../../lib/domain/amqp/emit'
import { enqueue } from '../../../../../../lib/domain/amqp/enqueue'
import { mergeFlow } from '../../../../../../lib/domain/flow'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { getSessionContext } from '../../../../../MoodleNetGraphQL'
import { EdgeType } from '../../../ContentGraph.graphql.gen'
import { createNode } from '../functions/createNode'
import { MoodleNetArangoContentGraphSubDomain } from '../MoodleNetArangoContentGraphSubDomain'
import { Persistence } from '../types'

export const createNodeWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoContentGraphSubDomain, 'ContentGraph.Node.Create'> => async ({
  ctx,
  data,
  nodeType,
  key,
}) => {
  const sessionCtx = getSessionContext(ctx)
  const mNode = await createNode({
    data,
    nodeType,
    persistence,
    key,
    creatorId: sessionCtx.profileId,
  })
  emit<MoodleNetArangoContentGraphSubDomain>()(
    `ContentGraph.Node.Created`,
    { node: mNode },
    mergeFlow(ctx.flow, [nodeType]),
  )
  enqueue<MoodleNetArangoContentGraphSubDomain>()(`ContentGraph.Edge.Create`, ctx.flow)({
    ctx,
    data: {},
    edgeType: EdgeType.Created,
    from: sessionCtx.profileId,
    to: mNode._id,
  })

  return mNode
}
