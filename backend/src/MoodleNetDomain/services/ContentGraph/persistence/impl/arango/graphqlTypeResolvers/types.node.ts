import { Context } from '../../../../../../MoodleNetGraphQL'
import { ShallowNode, Types } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import {
  aqlstr,
  getEdgeBasicAccessPolicy,
  getGlyphBasicAccessFilter,
  getNodeBasicAccessPolicy,
} from '../ContentGraph.persistence.arango.helpers'

const DEFAULT_PAGE_LENGTH = 10
const _rel: Types.ResolverFn<
  Types.ResolversTypes['Page'],
  ShallowNode,
  Context,
  Types.RequireFields<Types.INode_RelArgs, 'edge'>
> = async (
  { _id: parentId, __typename: parentNodeType },
  { edge: { type: edgeType, node: targetNodeType, rev }, page },
  ctx,
  _info
) => {
  const mainSortProp = '_key'
  const queryDepth = [1, 1]

  const { db } = await DBReady
  const { after, first, last, before } = {
    last: 0,
    first: DEFAULT_PAGE_LENGTH,
    ...page,
  }
  const beforeCursor = before || after
  const getCursorToo = beforeCursor === after

  const pageLimit = (_: number | null, includeCursor: boolean) =>
    Math.min(_ || Infinity, DEFAULT_PAGE_LENGTH) +
    (includeCursor && getCursorToo ? 1 : 0)

  const afterPage =
    !after && !!before
      ? null
      : `${after ? `FILTER edge.${mainSortProp} > "${after}"` : ``}
    SORT edge.${mainSortProp}
    LIMIT ${pageLimit(first, false)}`

  const comparison = getCursorToo ? '<=' : '<'
  const beforePage =
    last && beforeCursor
      ? `${
          beforeCursor
            ? `FILTER edge.${mainSortProp} ${comparison} "${beforeCursor}"`
            : ``
        }
        SORT edge.${mainSortProp} DESC
        LIMIT ${pageLimit(last, true)}`
      : ``
  const edgeTypeFrom = rev ? targetNodeType : parentNodeType
  const edgeTypeTo = rev ? parentNodeType : targetNodeType

  const depth = queryDepth.join('..')
  const direction = rev ? 'INBOUND' : 'OUTBOUND'

  const targetEdgeAccessFilter = getGlyphBasicAccessFilter({
    ctx,
    glyphTag: 'edge',
    policy: getEdgeBasicAccessPolicy({
      accessType: 'read',
      edgeType,
    }),
  })

  const targetNodeAccessFilter = getGlyphBasicAccessFilter({
    ctx,
    glyphTag: 'node',
    policy: getNodeBasicAccessPolicy({
      accessType: 'read',
      nodeType: targetNodeType,
    }),
  })

  return Promise.all(
    [afterPage, beforePage].map((page) => {
      const q = page
        ? `
          FOR parentNode, edge 
            IN ${depth} ${direction} ${aqlstr(parentId)} ${edgeType}

            FILTER edge.from == '${edgeTypeFrom}' 
                && edge.to   == '${edgeTypeTo}'
                && ${targetEdgeAccessFilter}
            
            LET node = DOCUMENT(edge.${rev ? '_from' : '_to'})
            FILTER ${targetNodeAccessFilter}

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
}

export const NodeResolver = {
  _rel,
} as any
