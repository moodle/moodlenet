import { BV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import { GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNode } from '@moodlenet/common/lib/content-graph/types/node'
import { EdgeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { _ } from '../../bl/baseOperators'
import { AqlGraphEdgeByType } from '../../types'

export const getEdgeByNodesQ = <Type extends GraphEdgeType>({
  edgeType,
  from,
  to,
}: {
  edgeType: EdgeType
  from: BV<GraphNode | null>
  to: BV<GraphNode | null>
}) => {
  const q = _<AqlGraphEdgeByType<Type>>(`(
    let fromNode = ${from}
    let toNode = ${to}
    
    for e in ${edgeType}
      filter e._from == fromNode._id 
      && e._to == toNode._id 
    limit 1

    return e
  )[0]`)
  console.log(q)
  return q
}
