import { parseNodeId } from '@moodlenet/common/lib/utils/content-graph'
import { LookupWorkerInit } from '../../../../../../lib/domain/wrk'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'

export const getNode: LookupWorkerInit<MoodleNetDomain, 'ContentGraph.Node.ById'> = () => {
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
