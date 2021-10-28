import { Assumptions, BV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import { GraphNode, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { aq } from '../../../../../lib/helpers/arango/query'
import { EditNodeData } from '../../../../../ports/content-graph/node'
import { aqlGraphNode2GraphNode, getAqlAssumptions, graphNode2AqlIdentifier } from '../helpers'

export const updateNodeQ = <Type extends GraphNodeType>({
  nodeData,
  nodeId,
  type,
  assumptions,
}: {
  nodeData: BV<EditNodeData<Type>>
  nodeId: BV<GraphNode<Type> | null>
  type: GraphNodeType
  assumptions: Assumptions
}) => {
  const aqlAssumptions = getAqlAssumptions(assumptions)
  const q = aq<GraphNode<Type>>(`
    let editNode = ${nodeId}
    FILTER editNode &&  ${aqlAssumptions}
    UPDATE ${graphNode2AqlIdentifier('editNode')} WITH ${nodeData} into ${type}

    return ${aqlGraphNode2GraphNode('NEW')}
  `)
  // console.log(q)
  return q
}
