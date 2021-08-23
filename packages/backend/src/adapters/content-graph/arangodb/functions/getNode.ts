import {
  GraphNodeIdentifier,
  // GraphNodeIdentifierSlug,
  GraphNodeType,
} from '@moodlenet/common/lib/content-graph/types/node'
import { aq } from '../../../../lib/helpers/arango/query'
import { AqlGraphNodeByType } from '../types'
import { /* documentByNodeIdSlugQFrag, */ getAqlNodeByGraphNodeIdentifierQFrag } from './helpers'
// export const getNodeBySlugQ = <Type extends GraphNodeType = GraphNodeType>(slugId: GraphNodeIdentifierSlug) => {
//   const q = aq<AqlGraphNodeByType<Type>>(`
//     let node = ${documentByNodeIdSlugQFrag(slugId)}

//     return node
//   `)
//   return q
// }

export const getNodeByIdentifierQ = <Type extends GraphNodeType = GraphNodeType>(
  nodeIdentifier: GraphNodeIdentifier,
) => {
  const q = aq<AqlGraphNodeByType<Type>>(`
    let node = ${getAqlNodeByGraphNodeIdentifierQFrag(nodeIdentifier)}

    return node
  `)
  return q
}
