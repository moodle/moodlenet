import { GraphEdgeType } from '@moodlenet/common/dist/content-graph/types/edge'
import { GraphNode, GraphNodeType } from '@moodlenet/common/dist/content-graph/types/node'
import { aqlstr } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { Assertions, BV } from '../../../../../ports/content-graph/graph-lang/base'
import { Operators, operators } from '../../../../../ports/content-graph/relations/count'
import { _aqlBv } from '../../adapters/bl/bv'
import { getAqlAssertions, graphNode2AqlId } from '../helpers'

export const nodeRelationCountQ = ({
  edgeType,
  parentNode,
  inverse,
  targetNodeType,
  assertions,
}: {
  parentNode: BV<GraphNode>
  edgeType: GraphEdgeType
  targetNodeType: GraphNodeType
  inverse: Boolean
  assertions: Assertions
}) => {
  const targetSide = inverse ? 'from' : 'to'
  const parentSide = inverse ? 'to' : 'from'
  const aqlAssertions = getAqlAssertions(assertions)
  return _aqlBv<number>(`(    
  let parentNode = ${parentNode}
  FOR countingEdge IN ${edgeType}
    LET countingNode = Document(countingEdge._${targetSide})
    
    FILTER  countingEdge._${targetSide}Type == ${aqlstr(targetNodeType)}
            && countingEdge._${parentSide} == ${graphNode2AqlId('parentNode')}
            && ${aqlAssertions}

    COLLECT WITH COUNT INTO count
    
    RETURN count
  )[0]`)
}

export const arangoRelCountOperators: SockOf<typeof operators> = async () => REL_COUNT_OPERATORS
export const REL_COUNT_OPERATORS: Operators = {
  countingNode: _aqlBv('countingNode'),
  parentNode: _aqlBv('parentNode'),
  countingEdge: _aqlBv('countingEdge'),
}
