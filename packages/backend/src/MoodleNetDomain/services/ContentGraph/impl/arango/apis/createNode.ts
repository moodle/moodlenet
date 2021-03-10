import { emit } from '../../../../../../lib/domain/amqp/emit'
import { mergeFlow } from '../../../../../../lib/domain/flow'
import { WorkerInitImpl } from '../../../../../../lib/domain/wrk'
import { ulidKey } from '../../../../../../lib/helpers/arango'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'
import { ShallowNodeMeta } from '../../../types.node'
import { DBReady } from '../ContentGraph.persistence.arango.env'

export const createNode: WorkerInitImpl<MoodleNetDomain, 'ContentGraph.Node.Create'> = () => {
  return [
    async ({ ctx, data, nodeType, key }) => {
      key = key ?? ulidKey()
      const { graph } = await DBReady()
      const collection = graph.vertexCollection(nodeType)
      const _meta: ShallowNodeMeta = { created: new Date(), updated: new Date() }
      const { new: node } = await collection.save(
        { ...data, _key: key, __typename: nodeType, _meta },
        { returnNew: true },
      )
      emit<MoodleNetDomain>()(`ContentGraph.Node.Created`, { node }, mergeFlow(ctx.flow, [nodeType]))
      return node
    },
  ]
}
