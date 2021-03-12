import { emit } from '../../../../../../lib/domain/amqp/emit'
import { mergeFlow } from '../../../../../../lib/domain/flow'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
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
  const mNode = await createNode({
    data,
    nodeType,
    persistence,
    key,
  })

  emit<MoodleNetArangoContentGraphSubDomain>()(
    `ContentGraph.Node.Created`,
    { node: mNode },
    mergeFlow(ctx.flow, [nodeType]),
  )
  return mNode
}
