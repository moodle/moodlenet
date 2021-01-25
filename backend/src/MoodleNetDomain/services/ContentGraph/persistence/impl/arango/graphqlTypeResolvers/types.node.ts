import { Context } from '../../../../../../MoodleNetGraphQL'
import { nodeConstraints } from '../../../graphDefs/node-constraints'
import { ShallowNode, Types } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import {
  getNodeAccessFilter,
  stringify,
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
  const afterPage =
    !after && !!before
      ? null
      : `${after ? `FILTER edge.${mainSortProp} > "${after}"` : ``}
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

  const depth = queryDepth.join('..')
  const direction = rev ? 'INBOUND' : 'OUTBOUND'

  const {
    access: { read: nodeRead },
  } = nodeConstraints[targetNodeType]
  const nodeAccessFilter = getNodeAccessFilter({
    ctx,
    nodeRead,
    nodeVar: 'node',
  })
  return Promise.all(
    [afterPage, beforePage].map((page) => {
      const q = page
        ? `
          FOR parentNode, edge 
            IN ${depth} ${direction} ${stringify(parentId)} ${edgeType}

            FILTER edge.from == '${edgeTypeFrom}' && edge.to == '${edgeTypeTo}'
            
            LET node = DOCUMENT(edge.${rev ? '_from' : '_to'})
            
            FILTER ${nodeAccessFilter}

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
