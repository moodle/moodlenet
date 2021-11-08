import { GraphNode, GraphNodeType } from '@moodlenet/common/dist/content-graph/types/node'
import { aq, aqlstr } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { Assertions, BV } from '../../../../../ports/content-graph/graph-lang/base'
import { Data, Operators, operators } from '../../../../../ports/content-graph/node/edit'
import { _aqlBv } from '../../adapters/bl/baseOperators'
import { aqlGraphNode2GraphNode, getAqlAssertions, graphNode2AqlIdentifier } from '../helpers'

export const editNodeQ = <Type extends GraphNodeType>({
  data,
  nodeId,
  type,
  assertions,
}: {
  data: Data<Type>
  nodeId: BV<GraphNode<Type>>
  type: GraphNodeType
  assertions: Assertions
}) => {
  const aqlAssertions = getAqlAssertions(assertions)

  const q = aq<[old: GraphNode<Type>, new: GraphNode<Type>]>(`
    let editNode = ${nodeId}
    
    FILTER editNode 
          && ${aqlAssertions}
    
    UPDATE ${graphNode2AqlIdentifier('editNode')} WITH ${aqlstr(data)} into ${type}

    return [${aqlGraphNode2GraphNode('OLD')},${aqlGraphNode2GraphNode('NEW')}]
  `)
  // console.log(q)
  return q
}

export const arangoEditNodeOperators: SockOf<typeof operators> = async () => EDIT_NODE_OPERATORS
export const EDIT_NODE_OPERATORS: Operators = {
  editNode: _aqlBv('editNode'),
}
