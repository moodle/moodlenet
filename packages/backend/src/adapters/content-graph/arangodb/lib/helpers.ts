import { EdgeType, Page, PageInfo, PaginationInput } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Id, parseNodeId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Database } from 'arangojs'
import { Maybe } from 'graphql/jsutils/Maybe'
import { aqlstr } from '../../../../lib/helpers/arango'
const DEFAULT_PAGE_LENGTH = 10
const MAX_PAGE_LENGTH = 25

export const cursorPaginatedQuery = ({
  page,
  cursorProp,
  inverseSort = false,
  mapQuery,
}: {
  page: Maybe<PaginationInput>
  cursorProp: string
  inverseSort?: boolean
  mapQuery(pageFilterSortLimit: string): string
}) => {
  const { after, first, last, before } = {
    ...page,
    last: page?.last ?? 0,
    first: page?.first ?? DEFAULT_PAGE_LENGTH,
  }
  const beforeCursor = before || after
  const getCursorToo = beforeCursor === after

  const pageLimit = (_: number, pageType: 'after' | 'before') =>
    Math.min(_ || Infinity, MAX_PAGE_LENGTH) + (pageType === 'before' && getCursorToo ? 1 : 0)

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
    beforePageQuery:
      _beforePage &&
      mapQuery(`
        ${_beforePage}
        LET cursor = ${cursorProp}
      `),
    afterPageQuery:
      _afterPage &&
      mapQuery(`
        ${_afterPage}
        LET cursor = ${cursorProp}
      `),
  }
}

export const makePage = <P extends Page>({
  afterEdges,
  beforeEdges,
  pageEdgeTypename,
  pageTypename,
}: {
  afterEdges: P['edges'][number][]
  beforeEdges: P['edges'][number][]
  //@ts-expect-error
  pageTypename: P['__typename']
  pageEdgeTypename: P['edges'][number]['__typename']
}): P => {
  const edges: P['edges'] = beforeEdges
    .reverse()
    .concat(afterEdges)
    .map(_ => ({ ..._, __typename: pageEdgeTypename }))
  const pageInfo: PageInfo = {
    startCursor: edges[0]?.cursor ?? null,
    endCursor: edges[edges.length - 1]?.cursor ?? null,
    hasNextPage: true,
    hasPreviousPage: true,
    __typename: 'PageInfo',
  }
  const page = ({
    __typename: pageTypename,
    pageInfo,
    edges,
  } as any) as P
  return page
}

// TODO: Make it like cursorPaginatedQuery
export const skipLimitPagination = ({ page }: { page: Maybe<PaginationInput> }) => {
  const { after, first } = {
    ...page,
    first: page?.first ?? DEFAULT_PAGE_LENGTH,
  }
  const limit = Math.min(first, MAX_PAGE_LENGTH)
  const skip = Math.max((typeof after === 'number' ? after : -1) + 1, 0)
  return {
    limit,
    skip,
  }
}

export const updateRelationCountQuery = ({
  edgeType,
  nodeId,
  side,
  amount,
}: {
  edgeType: EdgeType
  nodeId: Id
  side: 'i' | 'o' //FIXME: use GQL Type
  amount: number
}) => {
  const { nodeType } = parseNodeId(nodeId)
  const q = `
    LET v = Document( ${aqlstr(nodeId)} )
      LET currRelCount = v._relCount.${edgeType}.${side} || 0
      UPDATE v WITH MERGE_RECURSIVE(v,{
        _relCount: {
          ${edgeType} : {
            ${side}: currRelCount + (${Math.floor(amount)})
          }
        }
      })

      IN ${nodeType} 
      
      RETURN NEW
  `
  return q
}

// export const mergeNodeMeta = ({ mergeMeta, nodeProp }: { mergeMeta: string; nodeProp: string }) =>
//   `MERGE_RECURSIVE(${nodeProp},{ ${NODE_META_PROP}: ${mergeMeta} })`

export const updateRelationCountsOnEdgeLife = ({
  life,
  edgeType,
  from,
  to,
}: {
  life: 'create' | 'delete'
  from: Id
  to: Id
  edgeType: EdgeType
}) => {
  const amount = life === 'create' ? 1 : -1
  const relationOut = updateRelationCountQuery({ edgeType, nodeId: from, side: 'o', amount })
  const relationIn = updateRelationCountQuery({ edgeType, nodeId: to, side: 'i', amount })
  return { relationIn, relationOut }
}

const MARK_DELETED_PROP = '_deleted'
export const isMarkDeleted = (varname: string) => `HAS(${varname}, "${MARK_DELETED_PROP}")`
export const markDeletedPatch = ({ byId }: { byId: Id }) => `{ ${MARK_DELETED_PROP}: {
    by: { _id: ${aqlstr(byId)} },
    at: DATE_NOW() 
  }
}`

const CREATED_PROP = '_created'
export const createdByAtPatch = (doc: object, byId: string) => `MERGE(
  ${aqlstr(doc)}, {
    ${CREATED_PROP}:{
      by: { _id: ${aqlstr(byId)}, id: ${aqlstr(byId)} },
      at: DATE_NOW() 
    }
  })`

export const toDocumentEdgeOrNode = (varname: string) => `MERGE(${varname}, ${pickDocumentEdgeOrNodeId(varname)})`
export const pickDocumentEdgeOrNodeId = (varname: string) => `{id: ${varname}._id}`

export const getOneResult = async (q: string, db: Database) => {
  const cursor = await db.query(q)
  const result = await cursor.next()
  cursor.kill()
  return result
}

export const getAllResults = async (q: string, db: Database) => {
  const cursor = await db.query(q)
  const results = await cursor.all()
  cursor.kill()
  return results
}

export const justExecute = async (q: string, db: Database) => {
  const cursor = await db.query(q)
  cursor.kill()
  const { count, extra } = cursor
  return {
    count,
    extra,
  }
}
