import { BV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import { GraphNode, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { aq } from '../../../../../lib/helpers/arango/query'
import { AqlGraphNode } from '../../types'
import { aqlGraphNode2GraphNode, graphNode2AqlIdentifier } from '../helpers'

export const deleteNodeQ = (nodeId: BV<GraphNode | null>, type: GraphNodeType) => {
  const q = aq<AqlGraphNode>(`
    let nodeToDelete = ${nodeId}
    REMOVE ${graphNode2AqlIdentifier('nodeToDelete')} IN ${type} OPTIONS { ignoreErrors: true }

    RETURN ${aqlGraphNode2GraphNode('OLD')}
  `)
  // console.log(q)
  return q
}
