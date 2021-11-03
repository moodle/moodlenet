import { GraphEdge, GraphEdgeType } from '@moodlenet/common/dist/content-graph/types/edge'
import { aq } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { Operators, operators } from '../../../../../ports/content-graph/edge/del'
import { Assertions, BV } from '../../../../../ports/content-graph/graph-lang/base'
import { _aqlBv } from '../../adapters/bl/baseOperators'
import { aqlGraphEdge2GraphEdge, aqlGraphNode2GraphNode, getAqlAssertions, graphEdge2AqlIdentifier } from '../helpers'

export const delEdgeQ = ({
  assertions,
  edge,
  type,
}: {
  edge: BV<GraphEdge>
  type: GraphEdgeType
  assertions: Assertions
}) => {
  const aqlAssertions = getAqlAssertions(assertions)

  const q = aq<GraphEdge | null>(`
    let delEdge = ${edge}
    let aqlEdge = DOCUMENT(${graphEdge2AqlIdentifier('delEdge')}._id)
    let aqlFromNode = DOCUMENT(aqlEdge._from)
    let aqlToNode = DOCUMENT(aqlEdge._to)
    let fromNode = ${aqlGraphNode2GraphNode('aqlFromNode')}
    let toNode = ${aqlGraphNode2GraphNode('aqlToNode')}

    FILTER ${aqlAssertions}

    REMOVE aqlEdge
      IN ${type} 
      OPTIONS { ignoreErrors: true }

    RETURN ${aqlGraphEdge2GraphEdge('OLD')}
  `)
  // console.log(q)
  return q
}
export const arangoDelEdgeOperators: SockOf<typeof operators> = async () => DEL_EDGE_OPERATORS
export const DEL_EDGE_OPERATORS: Operators = {
  delEdge: _aqlBv('delEdge'),
  fromNode: _aqlBv('fromNode'),
  toNode: _aqlBv('toNode'),
}
