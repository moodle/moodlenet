import { GraphEdgeType } from '@moodlenet/common/dist/content-graph/types/edge'
import { GraphNode, GraphNodeType } from '@moodlenet/common/dist/content-graph/types/node'
import { Maybe } from '@moodlenet/common/dist/utils/types'
import { aqlstr } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { Assertions, BV } from '../../../../../ports/content-graph/graph-lang/base'
import { Operators, operators } from '../../../../../ports/content-graph/relations/count'
import { _aqlBv } from '../../adapters/bl/baseOperators'
import { getAqlAssertions, graphNode2AqlId } from '../helpers'

export const nodeRelationCountQ = ({
  edgeType,
  parentNode,
  inverse,
  targetNodeTypes,
  assertions,
}: {
  parentNode: BV<GraphNode>
  edgeType: GraphEdgeType
  targetNodeTypes: Maybe<GraphNodeType[]>
  inverse: Boolean
  assertions: Assertions
}) => {
  const targetSide = inverse ? 'from' : 'to'
  const parentSide = inverse ? 'to' : 'from'
  const aqlAssertions = getAqlAssertions(assertions)
  const targetNodeTypesFilter = targetNodeTypes
    ? `&& countingEdge._${targetSide}Type IN ${aqlstr(targetNodeTypes)}`
    : ``
  const q = _aqlBv<number>(`(    
  let parentNode = ${parentNode}
  FOR countingEdge IN ${edgeType}
    LET countingNode = Document(countingEdge._${targetSide})
    
    FILTER  countingEdge._${parentSide} == ${graphNode2AqlId('parentNode')}
            ${targetNodeTypesFilter}
            && ${aqlAssertions}

    COLLECT WITH COUNT INTO count
    
    RETURN count
  )[0]`)
  // console.log('-----------------------------------------', q)
  return q
}

export const arangoRelCountOperators: SockOf<typeof operators> = async () => REL_COUNT_OPERATORS
export const REL_COUNT_OPERATORS: Operators = {
  countingNode: _aqlBv('countingNode'),
  parentNode: _aqlBv('parentNode'),
  countingEdge: _aqlBv('countingEdge'),
}
