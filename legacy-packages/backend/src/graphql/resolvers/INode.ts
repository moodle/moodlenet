import * as GQLTypes from '@moodlenet/common/dist/graphql/types.graphql.gen'
import { isJust } from '@moodlenet/common/dist/utils/array'
import { gqlNodeId2GraphNodeIdentifier } from '@moodlenet/common/dist/utils/content-graph/id-key-type-guards'
import * as countNodeRelationsAdapter from '../../ports/content-graph/relations/count'
import * as traversePorts from '../../ports/content-graph/relations/traverse'
import { Context } from '../types'
import { RequireFields, Resolver, ResolversTypes } from '../types.graphql.gen'
import { graphEdge2GqlEdge, graphNode2GqlNode } from './helpers'

export const getINodeResolver = (): {
  _rel: Resolver<ResolversTypes['RelPage'], GQLTypes.INode, Context, RequireFields<GQLTypes.Profile_RelArgs, 'type'>>
  _relCount: Resolver<
    ResolversTypes['Int'],
    GQLTypes.INode,
    Context,
    RequireFields<GQLTypes.Profile_RelCountArgs, 'type'>
  >
} => {
  return {
    async _rel(node, { targetTypes, type, inverse, page, targetIds }, ctx) {
      const parsed = gqlNodeId2GraphNodeIdentifier(node.id)

      if (!parsed) {
        throw new Error(`Can't parse node#id: ${node.id}`)
      }
      const { _type: fromType, _slug: fromSlug } = parsed

      const { items, pageInfo } = await traversePorts.port({
        sessionEnv: ctx.sessionEnv,
        edgeType: type,
        fromNode: { _slug: fromSlug, _type: fromType },
        inverse: !!inverse,
        page: {
          after: page?.after,
          before: page?.before,
          first: page?.first ?? 20,
          last: page?.last ?? 20,
        },
        targetNodeTypes: targetTypes,
        targetIds: targetIds?.map(id => gqlNodeId2GraphNodeIdentifier(id)).filter(isJust),
      })

      return {
        __typename: 'RelPage',
        pageInfo: {
          __typename: 'PageInfo',
          hasNextPage: pageInfo.hasNextPage,
          hasPreviousPage: pageInfo.hasPreviousPage,
          endCursor: pageInfo.endCursor,
          startCursor: pageInfo.startCursor,
        },
        edges: items.map(([cursor, { edge, node }]) => {
          const gqlEdge: GQLTypes.RelPageEdge = {
            __typename: 'RelPageEdge',
            cursor,
            edge: graphEdge2GqlEdge(edge),
            node: graphNode2GqlNode(node),
          }
          return gqlEdge
        }),
      }
    },
    async _relCount(node, { targetTypes, type, inverse }, ctx) {
      const parsed = gqlNodeId2GraphNodeIdentifier(node.id)
      if (!parsed) {
        throw new Error(`Can't parse node#id: ${node.id}`)
      }
      const { _type: fromType, _slug: fromSlug } = parsed

      return countNodeRelationsAdapter.port({
        edgeType: type,
        fromNode: { _slug: fromSlug, _type: fromType },
        sessionEnv: ctx.sessionEnv,
        inverse: !!inverse,
        targetNodeTypes: targetTypes,
      })
    },
  }
}
