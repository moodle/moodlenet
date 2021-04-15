import { isId } from '@moodlenet/common/lib/utils/content-graph'
import { GraphQLScalarType } from 'graphql'
import * as GQL from '../../../ContentGraph.graphql.gen'
import { getUserSessionProfile } from './merge.getUserSessionProfile'
import { createEdge } from './mutation/createEdge'
import { createNode } from './mutation/createNode'
import { deleteEdge } from './mutation/deleteEdge'
import { nodePropResolver } from './nodePropResolver'
import { gqlGlobalSearch } from './query/globalSearch'
import { node } from './query/node'
import { EdgeResolver } from './types.edge'
import { NodeResolver } from './types.node'

const checkIDOrError = (_?: string) => {
  if (!isId(_)) {
    throw 'invalid ID'
  }
  return _
}
const ID = new GraphQLScalarType({
  name: 'ID',
  serialize: String,
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
    //Nodes
    Profile: NodeResolver,
    Subject: NodeResolver,
    Resource: NodeResolver,
    Collection: NodeResolver,
    //Edges
    AppliesTo: EdgeResolver,
    Contains: EdgeResolver,
    Created: EdgeResolver,
    Follows: EdgeResolver,
    Likes: EdgeResolver,
    // Empty: {} as any, //TODO: define resolver
    // DateTime: {} as any, //TODO: define resolver
    // Never: null as never, //TODO: define resolver
    // Cursor: {} as any, //TODO: define resolver
    GlyphByAt: {
      by: nodePropResolver<GQL.GlyphByAt>('by') as any,
    },
    //@ts-expect-error
    ID,

    // Edge: {
    //   __resolveType: obj => {
    //     console.log({ Edge: obj })

    //     return edgeTypeFromId(obj._id) || null
    //   },
    // },
    // Node: {
    //   __resolveType: obj => {
    //     console.log({ Node: obj })

    //     return nodeTypeFromId(obj._id) || null
    //   },
    // },
    // INode: {
    //   __resolveType: obj => {
    //     console.log({ INode: obj })

    //     return nodeTypeFromId(obj._id) || null
    //   },
    // },
    // IEdge: {
    //   __resolveType: obj => {
    //     console.log({ IEdge: obj })

    //     return edgeTypeFromId(obj._id) || null
    //   },
    // },
  }
}
