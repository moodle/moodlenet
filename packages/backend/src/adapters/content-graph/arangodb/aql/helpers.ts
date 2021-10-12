import { BV } from 'my-moodlenet-common/lib/content-graph/bl/graph-lang'
import { GraphNode } from 'my-moodlenet-common/lib/content-graph/types/node'
import { Page, PageInfo, PageItem, PaginationInput } from 'my-moodlenet-common/lib/content-graph/types/page'
import { AQ, aqlstr } from '../../../../lib/helpers/arango/query'

export const cursorPaginatedQuery = <T>({
  page,
  cursorProp,
  inverseSort = false,
  mapQuery,
}: {
  page: PaginationInput
  cursorProp: string
  inverseSort?: boolean
  mapQuery(pageFilterSortLimit: string): AQ<T>
}) => {
  const { after, first, last, before } = page
  const beforeCursor = before || after
  const getCursorToo = beforeCursor === after

  const pageLimit = (_: number, pageType: 'after' | 'before') => _ + (pageType === 'before' && getCursorToo ? 1 : 0)

  const _afterPage =
    !after && !!before
      ? null
      : `${after ? `FILTER ${cursorProp} > ${aqlstr(after)}` : ``}
    SORT ${cursorProp} ${inverseSort ? 'DESC' : 'ASC'}
    LIMIT ${pageLimit(first, 'after')}
    `

  const beforeComparison = getCursorToo ? '<=' : '<'
  const _beforePage =
    last && beforeCursor
      ? `${beforeCursor ? `FILTER ${cursorProp} ${beforeComparison} ${aqlstr(beforeCursor)}` : ``}
        SORT ${cursorProp} ${inverseSort ? 'ASC' : 'DESC'}
        LIMIT ${pageLimit(last, 'before')}
      `
      : null

  return {
    beforePageQuery: _beforePage
      ? mapQuery(`
        ${_beforePage}
        LET cursor = ${cursorProp}
      `)
      : null,
    afterPageQuery: _afterPage
      ? mapQuery(`
        ${_afterPage}
        LET cursor = ${cursorProp}
      `)
      : null,
  }
}

export const makeAfterBeforePage = <T>({
  afterItems,
  beforeItems,
}: {
  afterItems: PageItem<T>[]
  beforeItems: PageItem<T>[]
}): Page<T> => {
  const items = beforeItems.reverse().concat(afterItems)
  return makePage({
    items,
    hasNextPage: !!afterItems.length,
    hasPreviousPage: !!beforeItems.length,
  })
}

export const makePage = <T>({
  items,
  hasNextPage,
  hasPreviousPage,
}: {
  items: PageItem<T>[]
  hasNextPage: boolean
  hasPreviousPage: boolean
}): Page<T> => {
  const [startCursor] = items[0] || []
  const [endCursor] = items[items.length - 1] || []
  const pageInfo: PageInfo = {
    startCursor,
    endCursor,
    hasNextPage,
    hasPreviousPage,
  }
  const page: Page<T> = {
    pageInfo,
    items,
  }
  return page
}
// TODO: Make it like cursorPaginatedQuery
export const forwardSkipLimitPagination = ({ page }: { page: PaginationInput }) => {
  const { after, first: limit } = page
  const skip = Math.max((typeof after === 'number' ? after : -1) + 1, 0)
  return {
    limit,
    skip,
  }
}
export const forwardSkipLimitPage = <T>({ docs, skip }: { docs: T[]; skip: number }) => {
  const items = docs.map<PageItem<T>>((item, i) => [i + skip, item])

  return makePage({ items, hasNextPage: !!items.length, hasPreviousPage: false })
}

// export const aqlGraphNode2GraphNode = <T extends GraphNodeType>(aqlGraphNode: AqlGraphNodeByType<T>) => {
//   // console.log(`aqlGraphNode2GraphNode `, aqlGraphNode)
//   // const {_type, _key}=aqlGraphNode  *****************
//   const [__type, __permId] = aqlGraphNode._id.split('/')
//   // *********************** */

//   const graphNode: GraphNode<T> = {
//     _type: __type! as T,
//     _permId: __permId!,
//     ...(aqlGraphNode as any),
//   }
//   return graphNode
// }

// export const graphNode2AqlGraphNode = <T extends GraphNodeType>(graphNode: GraphNode<T>) => {
//   const _key = graphNode._permId
//   const _id = `${graphNode._type}/${graphNode._permId}`
//   const aqlGraphNode: AqlGraphNodeByType<T> = {
//     _key,
//     _id,
//     ...(graphNode as any),
//   }
//   return aqlGraphNode
// }

// export const aqlGraphEdge2GraphEdge = <T extends GraphEdgeType>(aqlGraphEdge: AqlGraphEdgeByType<T>) => {
//   const [__type, id] = aqlGraphEdge._id.split('/')
//   const graphEdge: GraphEdge<T> = {
//     _type: __type! as T,
//     id,
//     ...(aqlGraphEdge as any),
//   }
//   return graphEdge
// }

export const aqlGraphEdge2GraphEdge = (edgeVar: string) => `${edgeVar} && MERGE(
  UNSET(MERGE({},${edgeVar}), '_id', '_key', '_from', '_to' ),
  { id: ${edgeVar}._key }
)`

export const graphNode2AqlIdentifier = (nodeVar: string | BV<GraphNode | null>) =>
  `{_id:${graphNode2AqlId(nodeVar)}, _key:${graphNode2AqlKey(nodeVar)}}`
export const graphNode2AqlId = (nodeVar: string | BV<GraphNode | null>) =>
  `CONCAT(${nodeVar}._type,'/',${nodeVar}._permId)`
export const graphNode2AqlKey = (nodeVar: string | BV<GraphNode | null>) => `${nodeVar}._permId`
export const graphNode2AqlGraphNode = (nodeVar: string | BV<GraphNode | null>) => `${nodeVar} && MERGE(
  UNSET(MERGE({},${nodeVar}), '_permId', '_type' ),
  {
    _key: ${nodeVar}._permId,
    _id: CONCAT( ${nodeVar}.__type, '/', ${nodeVar}._permId)
  }
)`

export const aqlGraphNode2GraphNode = (nodeVar: string) => `${nodeVar} && MERGE(
UNSET(MERGE({},${nodeVar}), '_id', '_key' ),
{ _permId: ${nodeVar}._key }
)`

// export const getOneAQFrag = <T>(_aq: AQ<T>) => aq<T>(`((${_aq})[${0}])`)

export const aqBV = <T>(q: BV<T>) => `RETURN ${q}` as AQ<T>
