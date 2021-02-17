import * as GQL from '../ContentGraph.graphql.gen'
import { getSessionAccountUser } from './merge.getSessionAccountUser'
import { createEdge } from './mutation/createEdge'
import { createNode } from './mutation/createNode'
// import { createEdge } from './mutation.createEdge'
// import { createNode } from './mutation.createNode'
// import { deleteEdge } from './mutation.deleteEdge'
// import { deleteNode } from './mutation.deleteNode'
// import { updateEdge } from './mutation.updateEdge'
// import { updateNode } from './mutation.updateNode'
import { node } from './query.node'
import { NodeResolver } from './types.node'

export const getGraphQLTypeResolvers = (): GQL.Resolvers => {
  return {
    Mutation: {
      createEdge,
      createNode,
      deleteEdge: (() => {}) as any, //TODO: define resolver
      deleteNode: (() => {}) as any, //TODO: define resolver
      updateEdge: (() => {}) as any, //TODO: define resolver
      updateNode: (() => {}) as any, //TODO: define resolver
    },
    Query: {
      node,
      getSessionAccountUser,
    },
    User: NodeResolver,
    Subject: NodeResolver,
    Empty: {} as any, //TODO: define resolver
    DateTime: {} as any, //TODO: define resolver
    Never: null as never, //TODO: define resolver
    Cursor: null as never, //TODO: define resolver
    //
    //
    // others are fine with default resolvers :  {} as any,
    Follows: {} as any,
    Node: {} as any,
    Edge: {} as any,
    AppliesTo: {} as any,
    Collection: {} as any,
    Contains: {} as any,
    Created: {} as any,
    Likes: {} as any,
    Resource: {} as any,
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
    Page: {} as any,
    PageEdge: {} as any,
    PageInfo: {} as any,
    UpdateEdgeMutationError: {} as any,
    UpdateEdgeMutationPayload: {} as any,
    UpdateEdgeMutationSuccess: {} as any,
    UpdateNodeMutationError: {} as any,
    UpdateNodeMutationPayload: {} as any,
    UpdateNodeMutationSuccess: {} as any,
  }
}
