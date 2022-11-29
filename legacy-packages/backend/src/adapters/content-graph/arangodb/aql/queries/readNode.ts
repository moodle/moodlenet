import { GraphNode, GraphNodeType } from '@moodlenet/common/dist/content-graph/types/node'
import { aq } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { Assertions, BV } from '../../../../../ports/content-graph/graph-lang/base'
import { Operators, operators } from '../../../../../ports/content-graph/node/read'
import { _aqlBv } from '../../adapters/bl/baseOperators'
import { /* aqlGraphNode2GraphNode, */ getAqlAssertions } from '../helpers'

export const readNodeQ = <Type extends GraphNodeType>({
  nodeId,
  assertions,
}: {
  nodeId: BV<GraphNode<Type>>
  assertions: Assertions
}) => {
  const aqlAssertions = getAqlAssertions(assertions)

  const q = aq<GraphNode<Type>>(`
    let readNode = ${nodeId}
    
    FILTER readNode 
          && ${aqlAssertions}

    RETURN readNode
    `)
  /*RETURN ${aqlGraphNode2GraphNode('readNode')}*/
  return q
}

export const arangoReadNodeOperators: SockOf<typeof operators> = async () => READ_NODE_OPERATORS
export const READ_NODE_OPERATORS: Operators = {
  readNode: _aqlBv('readNode'),
}
