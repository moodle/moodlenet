import { Context } from '../../../../../../MoodleNetGraphQL'
import { ShallowNode, Types } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'

export const getGraphQLTypeResolvers = (): Omit<
  Types.Resolvers,
  'Mutation' | 'Query'
> => {
  return {
    User: NodeResolver as any,
    Subject: NodeResolver as any,
    Follows: {} as any,
    ByAt: {} as any,
    CreateEdgeMutationError: {} as any,
    CreateEdgeMutationPayload: {} as any,
    CreateEdgeMutationSuccess: {} as any,
    CreateNodeMutationError: {} as any,
    CreateNodeMutationPayload: {} as any,
    CreateNodeMutationSuccess: {} as any,
    DateTime: {} as any,
    DeleteEdgeMutationError: {} as any,
    DeleteEdgeMutationPayload: {} as any,
    DeleteEdgeMutationSuccess: {} as any,
    DeleteNodeMutationError: {} as any,
    DeleteNodeMutationPayload: {} as any,
    DeleteNodeMutationSuccess: {} as any,
    Edge: {} as any,
    Empty: {} as any,
    IEdge: {} as any,
    INode: {} as any,
    Meta: {} as any,
    Node: {} as any,
    Page: {} as any,
    PageEdge: {} as any,
    PageInfo: {} as any,
    UpdateEdgeMutationError: {} as any,
    UpdateEdgeMutationPayload: {} as any,
    UpdateEdgeMutationSuccess: {} as any,
    UpdateNodeMutationError: {} as any,
    UpdateNodeMutationPayload: {} as any,
    UpdateNodeMutationSuccess: {} as any,
    QueryNodeError: {} as any,
    QueryNodePayload: {} as any,
    QueryNodeSuccess: {} as any,
  }
}

const DEFAULT_PAGE_LENGTH = 10
const NodeResolver: {
  _edges: Types.ResolverFn<
    Types.ResolversTypes['Page'],
    ShallowNode,
    Context,
    Types.RequireFields<Types.INode_EdgesArgs, 'type'>
  >
} = {
  async _edges(
    { _id: parentId, _meta, __typename: parentNodeType },
    { type: { name: edgeType, node: targetNodeType, rev }, page },
    { auth: _auth },
    _info
  ) {
    const mainSortProp = '_id'
    const depth = [1, 1]

    const { db } = await DBReady
    const { after, first, last, before } = {
      last: 0,
      first: DEFAULT_PAGE_LENGTH,
      before: page?.after,
      ...page,
    }
    const afterPage = `${
      after ? `FILTER edge.${mainSortProp} > "${after}"` : ``
    }
    SORT edge.${mainSortProp}
    LIMIT ${Math.min(first || 0, DEFAULT_PAGE_LENGTH)}`

    const beforeCurs = before || after
    const getCursorToo = beforeCurs === after
    const comparison = getCursorToo ? '<=' : '<'
    const beforePage =
      last && beforeCurs
        ? `${
            beforeCurs
              ? `FILTER edge.${mainSortProp} ${comparison} "${beforeCurs}"`
              : ``
          }
        SORT edge.${mainSortProp} DESC
        LIMIT ${Math.min(last, DEFAULT_PAGE_LENGTH) + (getCursorToo ? 1 : 0)}`
        : ``
    const edgeTypeFrom = rev ? targetNodeType : parentNodeType
    const edgeTypeTo = rev ? parentNodeType : targetNodeType
    return Promise.all(
      [afterPage, beforePage].map((page) => {
        const q = page
          ? `
          FOR parentNode, edge 
            IN ${depth.join('..')} 
            ${rev ? 'INBOUND' : 'OUTBOUND'} 
            "${parentId}" 
            ${edgeType}
            FILTER edge.from == '${edgeTypeFrom}' && edge.to == '${edgeTypeTo}'
            
            LET node = DOCUMENT(edge.${rev ? '_from' : '_to'})
            
            ${page}

            RETURN  {
              cursor: edge['${mainSortProp}'],
              edge,
              node
            }
          `
          : null

        console.log(q)
        return q ? db.query(q).then((cursor) => cursor.all()) : []
      })
    ).then(([afterEdges, beforeEdges]) => {
      const edges = beforeEdges
        .reverse()
        .concat(afterEdges)
        .map((_) => ({ ..._, __typename: 'PageEdge' }))
      const pageInfo: Types.PageInfo = {
        startCursor: edges[0]?.cursor,
        endCursor: edges[edges.length - 1]?.cursor,
        hasNextPage: true,
        hasPreviousPage: false,
        __typename: 'PageInfo',
      }
      return {
        __typename: 'Page',
        pageInfo,
        edges,
      }
    })
  },
}
