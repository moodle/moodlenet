import { GraphEdge, GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { aq, AqlVar } from '../../../../../lib/helpers/arango/query'
import { AqlGraphEdgeByType } from '../../types'

export const getEdgeByNodesQ = <Type extends GraphEdgeType>({
  edge,
  from,
  to,
}: {
  edge: GraphEdge<Type>
  from: AqlVar
  to: AqlVar
}) => {
  const edgeType = edge._type

  const q = aq<AqlGraphEdgeByType<Type>>(`
    let fromNode = ${from}
    let toNode = ${to}
    
    for e in ${edgeType}
      filter e._from == fromNode._id 
      && e._to == toNode._id 
    limit 1

    return e
  `)
  // console.log(q)
  return q
}
