import { getGlyphBasicAccessFilter } from '../../../../graphDefinition/helpers'
import { ContentGraphPersistence, Types } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import {
  aqlstr,
  basicAccessFilterEngine,
} from '../ContentGraph.persistence.arango.helpers'

const DEFAULT_PAGE_LENGTH = 10

export const traverseEdges: ContentGraphPersistence['traverseEdges'] = async ({
  ctx,
  edgeType,
  page,
  parentNodeId,
  parentNodeType,
  inverse,
  targetNodeType,
  edgePolicy,
  targetNodePolicy,
}): Promise<Types.Page> => {
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
  const fromNodeType = inverse ? targetNodeType : parentNodeType
  const toNodeType = inverse ? parentNodeType : targetNodeType

  const depth = queryDepth.join('..')
  const direction = inverse ? 'INBOUND' : 'OUTBOUND'

  const targetEdgeAccessFilter = getGlyphBasicAccessFilter({
    ctx,
    glyphTag: 'edge',
    policy: edgePolicy,
    engine: basicAccessFilterEngine,
  })

  const targetNodeAccessFilter = getGlyphBasicAccessFilter({
    ctx,
    glyphTag: 'node',
    policy: targetNodePolicy,
    engine: basicAccessFilterEngine,
  })

  return Promise.all(
    [afterPage, beforePage].map((page) => {
      const q = page
        ? `
          FOR parentNode, edge 
            IN ${depth} ${direction} ${aqlstr(parentNodeId)} ${edgeType}

            FILTER edge.from == '${fromNodeType}' 
                && edge.to   == '${toNodeType}'
                && ${targetEdgeAccessFilter}
            
            LET node = DOCUMENT(edge.${inverse ? '_from' : '_to'})            
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
    const page: Types.Page = {
      __typename: 'Page',
      pageInfo,
      edges,
    }
    return page
  })
}
