import { GraphEdge, GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNodeIdentifier } from '@moodlenet/common/lib/content-graph/types/node'
import { aq } from '../../../../lib/helpers/arango/query'
import { AqlGraphEdgeByType } from '../types'
import { getAqlNodeByGraphNodeIdentifierQ } from './helpers'

export const getEdgeByNodesQ = <Type extends GraphEdgeType>({
  edge,
  from,
  to,
}: {
  edge: GraphEdge<Type>
  from: GraphNodeIdentifier
  to: GraphNodeIdentifier
}) => {
  const edgeType = edge._type

  const q = aq<AqlGraphEdgeByType<Type>>(`
    let fromNode = ${getAqlNodeByGraphNodeIdentifierQ(from)}
    let toNode = ${getAqlNodeByGraphNodeIdentifierQ(to)}
    
    for e in ${edgeType}
      filter e._from == fromNode._id 
      && e._to == toNode._id 
    limit 1

    return e
  `)
  // console.log(q)
  return q
}
