import { BV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import { GraphNode, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { aq, aqlstr } from '../../../../../lib/helpers/arango/query'
import { EditNodeData } from '../../../../../ports/content-graph/node'
import { aqlGraphNode2GraphNode, graphNode2AqlIdentifier } from '../helpers'

export const updateNodeQ = <Type extends GraphNodeType>({
  nodeData,
  nodeId,
}: {
  nodeData: EditNodeData<Type>
  nodeId: BV<GraphNode<Type> | null>
}) => {
  const q = aq<GraphNode<Type>>(`
    let node = ${nodeId}
    UPDATE ${graphNode2AqlIdentifier('node')} WITH ${aqlstr(nodeData)} into ${nodeData._type}

    return ${aqlGraphNode2GraphNode('NEW')}
  `)
  // console.log(q)
  return q
}
