import { BV } from 'my-moodlenet-common/lib/content-graph/bl/graph-lang'
import { GraphNode, GraphNodeType } from 'my-moodlenet-common/lib/content-graph/types/node'
import { aq } from '../../../../../lib/helpers/arango/query'
import { AqlGraphNode } from '../../types'
import { aqlGraphNode2GraphNode } from '../helpers'

export const deleteNodeQ = (nodeId: BV<GraphNode | null>, type: GraphNodeType) => {
  const q = aq<AqlGraphNode>(`
    let nodeToDelete = ${nodeId}
    REMOVE nodeToDelete IN ${type} OPTIONS { ignoreErrors: true }

    RETURN ${aqlGraphNode2GraphNode('OLD')}
  `)
  // console.log(q)
  return q
}
