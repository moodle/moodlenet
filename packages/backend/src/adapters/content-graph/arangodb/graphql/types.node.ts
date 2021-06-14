import * as GQLCommon from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Database } from 'arangojs'
import { Document } from 'arangojs/documents'
import * as GQLResolvers from '../../../../graphql/types.graphql.gen'
import { ShallowNode } from '../../../../graphql/types.node'
import { getProfileId, isGuest } from '../../../../lib/auth/env'
import { SessionEnv } from '../../../../lib/auth/types'
import { getAllResults } from '../../../../lib/helpers/arango'
import { makePage } from '../functions/helpers'
import { traverseEdges } from '../functions/traverseEdges'

// FIXME!!!: relation query functionalities should be properly modeled
// for port/adapter pattern, likely at Moodlenet level
// and used at high level graphqlResolvers
// as business logic should be performed in ports
// and assertions should be passed right to adapter
// ( consider also the monolitic object declaring all graph-access assertions (as before) )
// point is `db: Database` should not appear here, graphql layer may run in an http-only machine
// this issue also apply to other node `feature prop`, but not atm
// see: packages/backend/src/ports/content-graph/search.ts
// FIXME!!!
const _rel =
  (
    db: Database,
  ): GQLResolvers.ResolverFn<
    GQLResolvers.ResolversTypes['RelPage'],
    Document<ShallowNode>,
    SessionEnv,
    GQLResolvers.RequireFields<GQLCommon.INode_RelArgs, 'edge'>
  > =>
  async (parent, args, env, _info) => {
    const { _id: parentId } = parent
    const {
      edge: { type: edgeType, node: targetNodeType, inverse, targetMe, targetIDs },
      page,
    } = args

    const isOnlyTargetingMe = targetMe && !targetIDs

    if (isOnlyTargetingMe && isGuest(env)) {
      return {
        __typename: 'RelPage',
        edges: [],
        pageInfo: { __typename: 'PageInfo', hasNextPage: false, hasPreviousPage: false },
      }
    }

    const targetNodeIds = targetMe ? [getProfileId(env)] : targetIDs ?? []

    const { afterPageQuery, beforePageQuery } = traverseEdges({
      edgeType,
      parentNodeId: parentId as Id,
      inverse: !!inverse,
      targetNodeType,
      page,
      targetNodeIds,
    })

    const [afterEdges, beforeEdges] = await Promise.all(
      [afterPageQuery, beforePageQuery].map(pageQuery => (pageQuery ? getAllResults(pageQuery, db) : [])),
    )
    if (!(afterEdges && beforeEdges)) {
      throw new Error('should never happen')
    }
    const relationsPage = makePage<GQLCommon.RelPage>({
      afterEdges,
      beforeEdges,
      pageEdgeTypename: 'RelPageEdge',
      pageTypename: 'RelPage',
    })

    return relationsPage
  }

type RelCount = {
  [e in GQLCommon.EdgeType]?: {
    [dir in 'from' | 'to']: {
      [t in GQLCommon.NodeType]?: number
    }
  }
}

type NodeDocumentWithRelCount = Document<ShallowNode> & { _relCount?: RelCount | null }
export const _relCount: GQLResolvers.ResolverFn<
  GQLResolvers.ResolversTypes['Int'],
  NodeDocumentWithRelCount,
  SessionEnv,
  GQLResolvers.RequireFields<GQLCommon.INode_RelCountArgs, 'type' | 'target'>
> = async (parent, { target, type, inverse }, _env, _info) => {
  const count = parent?._relCount?.[type]?.[inverse ? 'from' : 'to']?.[target] ?? 0
  return Math.round(count)
}

export const nodeResolver = (db: Database) => {
  return {
    _rel: _rel(db),
    _relCount,
    id: (parent: Document<ShallowNode>) => parent._id,
  } as any
}
