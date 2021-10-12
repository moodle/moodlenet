import { BV } from 'my-moodlenet-common/lib/content-graph/bl/graph-lang'
import { GraphEdge, GraphEdgeType } from 'my-moodlenet-common/lib/content-graph/types/edge'
import { GraphNode } from 'my-moodlenet-common/lib/content-graph/types/node'
import { EdgeType } from 'my-moodlenet-common/lib/graphql/types.graphql.gen'
import { _ } from '../../adapters/bl/_'
import { aqlGraphEdge2GraphEdge } from '../helpers'

export const getEdgeByNodesQ = <Type extends GraphEdgeType>({
  edgeType,
  from,
  to,
}: {
  edgeType: EdgeType
  from: BV<GraphNode | null>
  to: BV<GraphNode | null>
}) => {
  const q = _<GraphEdge<Type>>(`(
    let fromNode = ${from}
    let toNode = ${to}
    
    for e in ${edgeType}
      filter e._from == fromNode._id 
      && e._to == toNode._id 
    limit 1

    return ${aqlGraphEdge2GraphEdge('e')}
  )[0]`)
  console.log(q)
  return q
}
