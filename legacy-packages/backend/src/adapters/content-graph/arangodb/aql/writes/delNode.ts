import { GraphNode, GraphNodeType } from '@moodlenet/common/dist/content-graph/types/node'
import { aq } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { Assertions, BV } from '../../../../../ports/content-graph/graph-lang/base'
import { Operators, operators } from '../../../../../ports/content-graph/node/del'
import { _aqlBv } from '../../adapters/bl/baseOperators'
import { AqlGraphNode } from '../../types'
import { aqlGraphNode2GraphNode, getAqlAssertions, graphNode2AqlIdentifier } from '../helpers'

export const deleteNodeQ = ({
  nodeId,
  type,
  assertions,
}: {
  assertions: Assertions
  nodeId: BV<GraphNode>
  type: GraphNodeType
}) => {
  const aqlAssertions = getAqlAssertions(assertions)

  const q = aq<AqlGraphNode>(`
    let delNode = ${nodeId}
    
    FILTER ${aqlAssertions}

    REMOVE ${graphNode2AqlIdentifier('delNode')} 
      IN ${type} 
      OPTIONS { ignoreErrors: true }

    RETURN ${aqlGraphNode2GraphNode('OLD')}
  `)
  // console.log(q)
  return q
}

export const arangoDelNodeOperators: SockOf<typeof operators> = async () => DEL_NODE_OPERATORS
export const DEL_NODE_OPERATORS: Operators = {
  delNode: _aqlBv('delNode'),
}
