import { GraphEdge, GraphEdgeType } from '@moodlenet/common/dist/content-graph/types/edge'
import { GraphNode } from '@moodlenet/common/dist/content-graph/types/node'
import { omit } from '@moodlenet/common/dist/utils/object'
import { DistOmit } from '@moodlenet/common/dist/utils/types'
import { aq, aqlstr } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { Operators, operators } from '../../../../../ports/content-graph/edge/add'
import { Assertions, BV } from '../../../../../ports/content-graph/graph-lang/base'
import { _aqlBv } from '../../adapters/bl/baseOperators'
import { AqlGraphEdge } from '../../types'
import { aqlGraphEdge2GraphEdge, getAqlAssertions, graphNode2AqlId } from '../helpers'

export const createEdgeQ = <Type extends GraphEdgeType>({
  edge,
  from,
  to,
  assertions,
}: {
  edge: GraphEdge<Type>
  from: BV<GraphNode>
  to: BV<GraphNode>
  assertions: Assertions
}) => {
  const edgeType = edge._type
  const aqlEdge: DistOmit<
    AqlGraphEdge,
    '_key' | '_from' | '_to' | '_created' | '_rev' | '_id' | '_fromType' | '_toType'
  > = {
    _key: edge.id,
    ...omit(edge, ['id']),
  }

  const aqlAssertions = getAqlAssertions(assertions)
  const q = aq<GraphEdge<Type>>(`
    let fromNode = ${from}
    let toNode = ${to}
    
    let addEdge = ${aqlstr(aqlEdge)}

    FILTER fromNode && toNode && ${aqlAssertions}

    INSERT MERGE(
      addEdge,
      {
        _from: ${graphNode2AqlId('fromNode')},
        _fromType:fromNode._type,
        _to: ${graphNode2AqlId('toNode')},
        _toType:toNode._type
      }
    )
    
    into ${edgeType}

    return ${aqlGraphEdge2GraphEdge('NEW')}
  `)
  // console.log('**', q)
  return q
}

export const arangoAddEdgeOperators: SockOf<typeof operators> = async () => ADD_EDGE_OPERATORS
export const ADD_EDGE_OPERATORS: Operators = {
  fromNode: _aqlBv('fromNode'),
  toNode: _aqlBv('toNode'),
}
