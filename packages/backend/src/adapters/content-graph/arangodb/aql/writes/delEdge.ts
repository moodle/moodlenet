import { GraphEdge, GraphEdgeType } from '@moodlenet/common/dist/content-graph/types/edge'
import { aq } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { Operators, operators } from '../../../../../ports/content-graph/edge/del'
import { Assertions, BV } from '../../../../../ports/content-graph/graph-lang/base'
import { _aqlBv } from '../../adapters/bl/bv'
import { aqlGraphEdge2GraphEdge, getAqlAssertions } from '../helpers'

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
    let aqlEdgeId = { _key: delEdge.id }
    let fromNode = DOCUMENT(aqlEdgeId._from)
    let toNode = DOCUMENT(aqlEdgeId._to)

    FILTER ${aqlAssertions}

    REMOVE aqlEdgeId
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
