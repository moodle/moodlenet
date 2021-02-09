import { createMeta } from '../../../../apis/helpers'
import { CreateEdgeMutationErrorType } from '../../../../ContentGraph.graphql.gen'
import { getConnectionDef } from '../../../../graphDefinition'
import {
  getStaticFilteredEdgeBasicAccessPolicy,
  getStaticFilteredNodeBasicAccessPolicy,
  nodeTypeFromId,
} from '../../../../graphDefinition/helpers'
import { cantBindMessage } from '../../../../graphDefinition/strings'
import { createEdgeMutationError } from '../../../../graphql.resolvers/helpers'
import { ContentGraphPersistence } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import { findNodeWithPolicy } from './findNode'

export const createEdge: ContentGraphPersistence['createEdge'] = async ({ ctx, data, to, from, edgeType }) => {
  const { graph } = await DBReady
  const { auth } = ctx
  const fromType = nodeTypeFromId(from)
  const toType = nodeTypeFromId(to)
  if (!(fromType && toType)) {
    return {
      __typename: 'CreateEdgeMutationError',
      type: CreateEdgeMutationErrorType.UnexpectedInput,
    }
  }
  const edgePolicy = getStaticFilteredEdgeBasicAccessPolicy({
    accessType: 'create',
    edgeType,
    ctx,
  })
  const connection = getConnectionDef({
    edge: edgeType,
    from: fromType,
    to: toType,
  })
  if (!connection) {
    return createEdgeMutationError(CreateEdgeMutationErrorType.NotAllowed, cantBindMessage({ edgeType, from, to }))
  }

  const fromPolicy = getStaticFilteredNodeBasicAccessPolicy({
    accessType: 'read',
    nodeType: fromType,
    ctx,
  })
  const toPolicy = getStaticFilteredNodeBasicAccessPolicy({
    accessType: 'read',
    nodeType: toType,
    ctx,
  })

  if (!(edgePolicy && auth && toPolicy && fromPolicy)) {
    return createEdgeMutationError(
      CreateEdgeMutationErrorType.UnexpectedInput,
      `missing one of:
edgePolicy:${edgePolicy} 
auth.userId:${auth?.userId} 
toPolicy:${toPolicy} 
fromPolicy:${fromPolicy}`,
    )
  }

  const [fromNode, toNode] = await Promise.all([
    findNodeWithPolicy({
      _id: from,
      ctx,
      nodeType: fromType,
      policy: fromPolicy,
    }),
    findNodeWithPolicy({ _id: to, ctx, nodeType: toType, policy: toPolicy }),
  ])

  if (!(fromNode && toNode)) {
    return createEdgeMutationError(
      CreateEdgeMutationErrorType.NotAuthorized,
      `cannot find or access both nodes, found: fromNode[${from}]:${!!fromNode} toNode[${to}]:${!!toNode}`,
    )
  }

  const _meta = createMeta(auth)

  const collection = graph.edgeCollection(edgeType)
  const { new: edge } = await collection.save({ ...data, _meta, _from: from, _to: to }, { returnNew: true })
  console.log('created edge', edge)
  return edge
}
