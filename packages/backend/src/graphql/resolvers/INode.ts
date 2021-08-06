import * as GQLTypes from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { parseNodeId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { QMino } from '../../lib/qmino'
import * as traversePorts from '../../ports/content-graph/traverseNodeRel'
import { Context } from '../types'
import { RequireFields, Resolver, ResolversTypes } from '../types.graphql.gen'
import { graphEdge2GqlEdge, graphNode2GqlNode } from './helpers'

export const getINodeResolver = ({
  qmino,
}: {
  qmino: QMino
}): {
  _rel: Resolver<
    ResolversTypes['RelPage'],
    GQLTypes.INode,
    Context,
    RequireFields<GQLTypes.Profile_RelArgs, 'type' | 'target'>
  >
  _relCount: Resolver<
    ResolversTypes['Int'],
    GQLTypes.INode,
    Context,
    RequireFields<GQLTypes.Profile_RelCountArgs, 'type' | 'target'>
  >
} => {
  return {
    async _rel(node, { target, type, inverse, page }, ctx) {
      const parsed = parseNodeId(node.id)
      if (!parsed) {
        throw `FIXME _rel`
      }
      const [fromType, fromSlug] = parsed

      const { items, pageInfo } = await qmino.query(
        traversePorts.fromNode({
          env: ctx.authSessionEnv,
          edgeType: type,
          fromNode: { _slug: fromSlug, _type: fromType },
          inverse: !!inverse,
          page: {
            after: page?.after,
            before: page?.before,
            first: page?.first ?? 20,
            last: page?.last ?? 20,
          },
          targetNodeType: target,
        }),
        { timeout: 5000 },
      )

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
    async _relCount(node, { target, type, inverse }, ctx) {
      const parsed = parseNodeId(node.id)
      if (!parsed) {
        throw `FIXME _rel`
      }
      const [fromType, fromSlug] = parsed

      return await qmino.query(
        traversePorts.count({
          edgeType: type,
          fromNode: { _slug: fromSlug, _type: fromType },
          env: ctx.authSessionEnv,
          inverse: !!inverse,
          targetNodeType: target,
        }),
        { timeout: 5000 },
      )
    },
  }
}
