import { GraphNode, GraphNodeType } from '@moodlenet/common/dist/content-graph/types/node'
import { aq, aqlstr } from '../../../../../lib/helpers/arango/query'
import { aqlGraphEdge2GraphEdge } from '../helpers'

export const getNodesByExampleQ = <Type extends GraphNodeType>({
  nodeType,
  ex,
  limit = 1,
  skip = 0,
}: {
  nodeType: Type
  ex: Partial<GraphNode<Type>>
  limit?: number
  skip?: number
}) => {
  const q = aq<GraphNode<Type>>(`
    FOR node IN ${nodeType}
      FILTER MATCHES(node , ${aqlstr(ex)})
      LIMIT ${skip},${limit}
    return ${aqlGraphEdge2GraphEdge('node')}
  `)
  return q
}
