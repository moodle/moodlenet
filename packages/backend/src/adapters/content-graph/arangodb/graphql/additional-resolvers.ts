import * as GQLCommon from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Database } from 'arangojs'
import * as GQLResolvers from '../../../../graphql/types.graphql.gen'
import { nodePropResolver } from './nodePropResolver'
import { EdgeResolver } from './types.edge'
import { nodeResolver } from './types.node'
export const graphqlArangoContentGraphResolvers = (db: Database): GQLResolvers.Resolvers => {
  const NodeResolver = nodeResolver(db)
  return {
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

    //
    GlyphByAt: {
      by: nodePropResolver<GQLCommon.GlyphByAt>('by', db) as any,
    },

    // Empty: {} as any, //TODO: define resolver
    // DateTime: {} as any, //TODO: define resolver
    // Never: null as never, //TODO: define resolver
    // Cursor: {} as any, //TODO: define resolver

    // AssetRef,
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
