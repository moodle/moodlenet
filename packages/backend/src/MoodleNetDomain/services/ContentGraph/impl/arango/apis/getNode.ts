import { parseNodeId } from '@moodlenet/common/lib/utils/content-graph'
import { WorkerInitImpl } from '../../../../../../lib/domain/wrk'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'
import { DBReady } from '../ContentGraph.persistence.arango.env'

export const getNode: WorkerInitImpl<MoodleNetDomain, 'ContentGraph.Node.ById'> = () => {
  return [
    async ({
      // ctx,
      _id,
    }) => {
      const { graph } = await DBReady()
      const { nodeType, _key } = parseNodeId(_id)
      const collection = graph.vertexCollection(nodeType)
      const node = await collection.vertex({ _key })
      return node
    },
  ]
}
