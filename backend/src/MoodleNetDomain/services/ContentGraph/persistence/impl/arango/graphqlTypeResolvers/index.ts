import { Types } from '../../../types'
import { getSessionAccountUser } from './merge.getSessionAccountUser'
import { createEdge } from './mutation.createEdge'
import { createNode } from './mutation.createNode'
import { deleteEdge } from './mutation.deleteEdge'
import { deleteNode } from './mutation.deleteNode'
import { updateEdge } from './mutation.updateEdge'
import { updateNode } from './mutation.updateNode'
import { node } from './query.node'
import { NodeResolver } from './types.node'

export const getGraphQLTypeResolvers = (): Types.Resolvers => {
  return {
    Mutation: {
      createEdge,
      createNode,
      deleteEdge,
      deleteNode,
      updateEdge,
      updateNode,
    },
    Query: {
      node,
      getSessionAccountUser,
    },
    User: NodeResolver,
    Subject: NodeResolver,
    Empty: {} as any,
    DateTime: {} as any,

    // others are fine with default resolvers :  {} as any,
    Follows: {} as any,
    Node: {} as any,
    Edge: {} as any,
    ByAt: {} as any,
    UserSession: {} as any,
    CreateEdgeMutationError: {} as any,
    CreateEdgeMutationPayload: {} as any,
    CreateEdgeMutationSuccess: {} as any,
    CreateNodeMutationError: {} as any,
    CreateNodeMutationPayload: {} as any,
    CreateNodeMutationSuccess: {} as any,
    DeleteEdgeMutationError: {} as any,
    DeleteEdgeMutationPayload: {} as any,
    DeleteEdgeMutationSuccess: {} as any,
    DeleteNodeMutationError: {} as any,
    DeleteNodeMutationPayload: {} as any,
    DeleteNodeMutationSuccess: {} as any,
    IEdge: {} as any,
    INode: {} as any,
    Meta: {} as any,
    Page: {} as any,
    PageEdge: {} as any,
    PageInfo: {} as any,
    UpdateEdgeMutationError: {} as any,
    UpdateEdgeMutationPayload: {} as any,
    UpdateEdgeMutationSuccess: {} as any,
    UpdateNodeMutationError: {} as any,
    UpdateNodeMutationPayload: {} as any,
    UpdateNodeMutationSuccess: {} as any,
    // QueryNodeError: {} as any,
    // QueryNodePayload: {} as any,
    // QueryNodeSuccess: {} as any,
  }
}
