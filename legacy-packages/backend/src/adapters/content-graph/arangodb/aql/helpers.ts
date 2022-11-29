import { GraphEdge } from '@moodlenet/common/dist/content-graph/types/edge'
import { GraphNode } from '@moodlenet/common/dist/content-graph/types/node'
import { Page, PageInfo, PageItem, PaginationInput } from '@moodlenet/common/dist/content-graph/types/page'
import { CollectionType } from 'arangojs'
import { AQ, aqlstr, getAllResults } from '../../../../lib/helpers/arango/query'
import { Assertions, BV } from '../../../../ports/content-graph/graph-lang/base'
import { _aqlBv } from '../adapters/bl/baseOperators'
import { ContentGraphDB } from '../types'
import { deleteBrokenEdgesQ } from './writes/deleteBrokenEdgesQ'

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
//   const [__type, __permId] = aqlGraphNode._id.split('/')

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

export const graphNode2AqlIdentifier = (nodeVar: string | BV<GraphNode>) =>
  `{_id:${graphNode2AqlId(nodeVar)}, _key:${graphNode2AqlKey(nodeVar)}}`
export const graphNode2AqlId = (nodeVar: string | BV<GraphNode>) => `CONCAT(${nodeVar}._type,'/',${nodeVar}._permId)`
export const graphNode2AqlKey = (nodeVar: string | BV<GraphNode>) => `${nodeVar}._permId`
export const graphNode2AqlGraphNode = (nodeVar: string | BV<GraphNode>) => `${nodeVar} && MERGE(
  UNSET(MERGE({},${nodeVar}), '_permId' ),
  {
    _key: ${nodeVar}._permId,
    _id: CONCAT( ${nodeVar}._type, '/', ${nodeVar}._permId)
  }
)`
export const aqlGraphNode2GraphNode = (nodeVar: string) => `${nodeVar} && MERGE(
UNSET(MERGE({},${nodeVar}), '_id', '_key' ),
{ _permId: ${nodeVar}._key }
)`

export const graphEdge2AqlIdentifier = (edgeVar: string | BV<GraphEdge>) =>
  `{_id:${graphEdge2AqlId(edgeVar)}, _key:${graphEdge2AqlKey(edgeVar)}}`
export const graphEdge2AqlId = (edgeVar: string | BV<GraphEdge>) => `CONCAT(${edgeVar}._type,'/',${edgeVar}.id)`
export const graphEdge2AqlKey = (edgeVar: string | BV<GraphEdge>) => `${edgeVar}.id`
export const graphEdge2AqlGraphEdge = (edgeVar: string | BV<GraphEdge>) => `${edgeVar} && MERGE(
  UNSET(MERGE({},${edgeVar}), 'id' ),
  {
    _key: ${edgeVar}.id,
    _id: CONCAT( ${edgeVar}._type, '/', ${edgeVar}.id)
  }
)`
export const aqlGraphEdge2GraphEdge = (edgeVar: string) => `${edgeVar} && MERGE(
UNSET(MERGE({},${edgeVar}), '_id', '_key' ),
{ id: ${edgeVar}._key }
)`
// export const getOneAQFrag = <T>(_aq: AQ<T>) => aq<T>(`((${_aq})[${0}])`)

export const aqBV = <T>(q: BV<T>) => `RETURN ${q}` as AQ<T>

export const cleanupBrokenEdges = async (db: ContentGraphDB) => {
  const collections = await db.listCollections()
  const edgeCollectionNames = collections
    .filter(({ type }) => type === CollectionType.EDGE_COLLECTION)
    .map(({ name }) => name)

  console.log(`Cleaning up broken edges:`, edgeCollectionNames.join(' , '))
  return Promise.all(
    edgeCollectionNames.map(async name => {
      const q = deleteBrokenEdgesQ(name)
      const results = await getAllResults(q, db).catch(e => {
        const msg = `Error while cleaning up ${name}: ${e}`
        console.error(msg)
        return msg
      })
      return [name, results] as const
    }),
  )
}

export const getAqlAssertions = (assertions: Assertions) =>
  _aqlBv<boolean>(
    Object.entries(assertions)
      .map(([, assertion]) => assertion)
      .filter((assertion): assertion is BV<boolean> => !!assertion)
      .join(' && ') || 'true',
  )
