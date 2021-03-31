import { edgeTypeFromId, isId, nodeTypeFromId } from '@moodlenet/common/lib/utils/content-graph'
import { GraphQLScalarType } from 'graphql'
import * as GQL from '../../../ContentGraph.graphql.gen'
import { getUserSessionProfile } from './merge.getUserSessionProfile'
import { createEdge } from './mutation/createEdge'
import { createNode } from './mutation/createNode'
// import { createEdge } from './mutation.createEdge'
// import { createNode } from './mutation.createNode'
import { deleteEdge } from './mutation/deleteEdge'
import { nodePropResolver } from './nodePropResolver'
import { gqlGlobalSearch } from './query/globalSearch'
import { node } from './query/node'
import { NodeResolver } from './types.node'
// import { deleteNode } from './mutation.deleteNode'
// import { updateEdge } from './mutation.updateEdge'
// import { updateNode } from './mutation.updateNode'

const checkIDOrError = (_?: string) => {
  if (!isId(_)) {
    throw 'invalid ID'
  }
  return _
}
const ID = new GraphQLScalarType({
  name: 'ID',
  serialize: v => v,
  parseValue: v => checkIDOrError(v),
  parseLiteral: vnode => (vnode.kind === 'StringValue' ? checkIDOrError(vnode.value) : null),
})
export const getContentGraphResolvers = (): GQL.Resolvers => {
  return {
    Mutation: {
      createEdge,
      createNode,
      deleteEdge,
      deleteNode: (() => {}) as any, //TODO: define resolver
      updateEdge: (() => {}) as any, //TODO: define resolver
      updateNode: (() => {}) as any, //TODO: define resolver
    },
    Query: {
      node,
      getUserSessionProfile,
      globalSearch: gqlGlobalSearch,
    },
    Profile: NodeResolver,
    Subject: NodeResolver,
    Resource: NodeResolver,
    Collection: NodeResolver,
    NodeMeta: {
      creator: nodePropResolver<GQL.NodeMeta>('creator') as any,
    },
    // Empty: {} as any, //TODO: define resolver
    // DateTime: {} as any, //TODO: define resolver
    // Never: null as never, //TODO: define resolver
    // Cursor: {} as any, //TODO: define resolver

    //@ts-expect-error
    ID,

    Edge: {
      __resolveType: obj => {
        return edgeTypeFromId(obj._id) || null
      },
    },
    Node: {
      __resolveType: obj => {
        return nodeTypeFromId(obj._id) || null
      },
    },
    INode: {
      __resolveType: obj => {
        return nodeTypeFromId(obj._id) || null
      },
    },
    IEdge: {
      __resolveType: obj => {
        return edgeTypeFromId(obj._id) || null
      },
    },
  }
}
