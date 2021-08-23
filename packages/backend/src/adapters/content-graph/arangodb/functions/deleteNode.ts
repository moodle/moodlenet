import { GraphNodeIdentifier } from '@moodlenet/common/lib/content-graph/types/node'
import { aq } from '../../../../lib/helpers/arango/query'
import { AqlGraphNode } from '../types'
import { getAqlNodeByGraphNodeIdentifierQFrag } from './helpers'

export const deleteNodeQ = (nodeId: GraphNodeIdentifier) => {
  const q = aq<AqlGraphNode>(`
    let nodeToDeleteKey = ${getAqlNodeByGraphNodeIdentifierQFrag(nodeId)}._key
    REMOVE { _key: nodeToDeleteKey } IN ${nodeId._type} OPTIONS { ignoreErrors: true }

    RETURN OLD
  `)
  // console.log(q)
  return q
}
