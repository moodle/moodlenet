import { getContentGraphPersistence } from '../ContentGraph.env'
import * as GQL from '../ContentGraph.graphql.gen'
import {
  getStaticFilteredNodeBasicAccessPolicy,
  isId,
  isNodeType,
} from '../graphDefinition/helpers'

export const node: GQL.Resolvers['Query']['node'] = async (
  _root,
  { _id, nodeType },
  ctx /* ,_info */
) => {
  if (!(isId(_id) && isNodeType(nodeType))) {
    throw new Error(`Id[${_id}] or node type[${nodeType}] are not valid`) //FIXME
  }

  const { findNodeWithPolicy } = await getContentGraphPersistence()
  const policy = getStaticFilteredNodeBasicAccessPolicy({
    accessType: 'read',
    nodeType,
    ctx,
  })
  if (!policy) {
    // probably not allowed (may want to split in policy lookup in 2 steps, to check if found and then if auth applies )
    return null
  }

  const maybeNode = await findNodeWithPolicy({ _id, policy, nodeType, ctx })
  return maybeNode as any
}
