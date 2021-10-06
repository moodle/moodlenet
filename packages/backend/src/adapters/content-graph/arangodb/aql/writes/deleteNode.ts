import { GraphNodeIdentifier } from '@moodlenet/common/lib/content-graph/types/node'
import { aq } from '../../../../../lib/helpers/arango/query'
import { graphOperators } from '../../bl/graphOperators'
import { AqlGraphNode } from '../../types'
import { aqlGraphNode2GraphNode } from '../helpers'

export const deleteNodeQ = (nodeId: GraphNodeIdentifier) => {
  const q = aq<AqlGraphNode>(`
    let nodeToDelete = ${graphOperators.graphNode(nodeId)}
    REMOVE nodeToDelete IN ${nodeId._type} OPTIONS { ignoreErrors: true }

    RETURN ${aqlGraphNode2GraphNode('OLD')}
  `)
  // console.log(q)
  return q
}
