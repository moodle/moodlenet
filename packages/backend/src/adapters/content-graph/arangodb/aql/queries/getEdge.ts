import { GraphEdge, GraphEdgeType } from '@moodlenet/common/dist/content-graph/types/edge'
import { GraphNode } from '@moodlenet/common/dist/content-graph/types/node'
import { BV } from '../../../../../ports/content-graph/graph-lang/base'
import { _aqlBv } from '../../adapters/bl/bv'
import { aqlGraphEdge2GraphEdge } from '../helpers'

export const getEdgeByNodesQ = <Type extends GraphEdgeType>({
  edgeType,
  from,
  to,
}: {
  edgeType: Type
  from: BV<GraphNode>
  to: BV<GraphNode>
}) => {
  const q = _aqlBv<GraphEdge<Type>>(`(
    let fromNode = ${from}
    let toNode = ${to}
    
    for e in ${edgeType}
      filter e._from == fromNode._id 
      && e._to == toNode._id 
    limit 1

    return ${aqlGraphEdge2GraphEdge('e')}
  )[0]`)
  return q
}
