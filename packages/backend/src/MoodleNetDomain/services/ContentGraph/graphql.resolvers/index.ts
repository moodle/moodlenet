import { edgeTypeFromId, Id, nodeTypeFromId } from '@moodlenet/common/lib/utils/content-graph'
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
    Resource: NodeResolver,
    Collection: NodeResolver,
    Empty: {} as any, //TODO: define resolver
    DateTime: {} as any, //TODO: define resolver
    Never: null as never, //TODO: define resolver
    Cursor: null as never, //TODO: define resolver

    Edge: {
      __resolveType: obj => {
        return edgeTypeFromId(obj._id as Id) || null
      },
    },
    Node: {
      __resolveType: obj => {
        return nodeTypeFromId(obj._id as Id) || null
      },
    },
    INode: {
      __resolveType: obj => {
        return nodeTypeFromId(obj._id as Id) || null
      },
      _id: null as any,
      _rel: null as any,
    },
    IEdge: {
      __resolveType: obj => {
        return edgeTypeFromId(obj._id as Id) || null
      },
      _id: null as any,
    },

    //
    //
    // others are fine with default resolvers :  {} as any,
    Follows: {} as any,
    AppliesTo: {} as any,
    Contains: {} as any,
    Created: {} as any,
    Likes: {} as any,
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
    IContentNode: {} as any,
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
