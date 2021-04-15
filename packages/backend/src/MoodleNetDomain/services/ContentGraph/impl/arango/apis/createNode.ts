import { emit } from '../../../../../../lib/domain/amqp/emit'
import { enqueue } from '../../../../../../lib/domain/amqp/enqueue'
import { mergeFlow } from '../../../../../../lib/domain/flow'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { getSessionContext } from '../../../../../MoodleNetGraphQL'
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
  const { profileId: creatorProfileId } = getSessionContext(ctx)

  const mNode = await createNode({
    data,
    nodeType,
    persistence,
    key,
    ctx,
  })
  if (typeof mNode === 'string') {
    return mNode === 'no assertions found' ? 'UnexpectedInput' : 'NotAuthorized'
  }
  if ('CreateNodeAssertionsFailed' in mNode) {
    return 'AssertionFailed'
  }

  emit<MoodleNetArangoContentGraphSubDomain>()(
    `ContentGraph.Node.Created`,
    { node: mNode, creatorProfileId },
    mergeFlow(ctx.flow, [nodeType]),
  )
  enqueue<MoodleNetArangoContentGraphSubDomain>()(`ContentGraph.Edge.Create`, ctx.flow)({
    ctx,
    data: {},
    edgeType: 'Created',
    from: creatorProfileId,
    to: mNode.id,
  })

  return mNode
}
