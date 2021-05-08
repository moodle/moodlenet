import { EdgeType, Id, Page, PageInfo, PaginationInput, parseNodeId } from '@moodlenet/common/lib/utils/content-graph'
import { Maybe } from 'graphql/jsutils/Maybe'
import { aqlstr } from '../../../../lib/helpers/arango'
import { Persistence } from '../types'
const DEFAULT_PAGE_LENGTH = 10
const MAX_PAGE_LENGTH = 25

export const cursorPaginatedQuery = async <P extends Page>({
  page,
  cursorProp,
  mapQuery,
  pageEdgeTypename,
  pageTypename,
  persistence: { db },
  inverseSort = false,
}: {
  persistence: Persistence
  page: Maybe<PaginationInput>
  cursorProp: string
  inverseSort?: boolean
  mapQuery(pageFilterSortLimit: string): string
  //@ts-expect-error
  pageTypename: P['__typename']
  pageEdgeTypename: P['edges'][number]['__typename']
}): Promise<P> => {
  const { after, first, last, before } = {
    ...page,
    last: page?.last ?? 0,
    first: page?.first ?? DEFAULT_PAGE_LENGTH,
  }
  const beforeCursor = before || after
  const getCursorToo = beforeCursor === after

  const pageLimit = (_: number, pageType: 'after' | 'before') =>
    Math.min(_ || Infinity, MAX_PAGE_LENGTH) + (pageType === 'before' && getCursorToo ? 1 : 0)

  const afterPage =
    !after && !!before
      ? null
      : `${after ? `FILTER ${cursorProp} > ${aqlstr(after)}` : ``}
    SORT ${cursorProp} ${inverseSort ? 'DESC' : 'ASC'}
    LIMIT ${pageLimit(first, 'after')}
    `

  const beforeComparison = getCursorToo ? '<=' : '<'
  const beforePage =
    last && beforeCursor
      ? `${beforeCursor ? `FILTER ${cursorProp} ${beforeComparison} ${aqlstr(beforeCursor)}` : ``}
        SORT ${cursorProp} ${inverseSort ? 'ASC' : 'DESC'}
        LIMIT ${pageLimit(last, 'before')}
      `
      : null

  return Promise.all(
    ([afterPage, beforePage] as const).map(pageFilterSortLimit => {
      const q = pageFilterSortLimit
        ? mapQuery(`
        ${pageFilterSortLimit}
        LET cursor = ${cursorProp}
      `)
        : null

      // console.log(q)
      return q ? db.query(q).then(cursor => cursor.all()) : ([] as any[])
    }),
  ).then(([afterEdges, beforeEdges]) => {
    if (!(afterEdges && beforeEdges)) {
      throw new Error('should never happen')
    }
    return makePage<P>({ afterEdges, beforeEdges, pageEdgeTypename, pageTypename })
  })
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

export const updateRelationCountQuery = async ({
  persistence: { db },
  edgeType,
  nodeId,
  side,
  amount,
}: {
  persistence: Persistence
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
  // console.log(q)
  const cursor = await db.query(q)
  const res = await cursor.next()
  cursor.kill()
  return res
}

// export const mergeNodeMeta = ({ mergeMeta, nodeProp }: { mergeMeta: string; nodeProp: string }) =>
//   `MERGE_RECURSIVE(${nodeProp},{ ${NODE_META_PROP}: ${mergeMeta} })`

export const updateRelationCountsOnEdgeLife = async ({
  persistence,
  life,
  edgeType,
  from,
  to,
}: {
  persistence: Persistence
  life: 'create' | 'delete'
  from: Id
  to: Id
  edgeType: EdgeType
}) => {
  const amount = life === 'create' ? 1 : -1
  const qout = updateRelationCountQuery({ persistence, edgeType, nodeId: from, side: 'o', amount })
  const qin = updateRelationCountQuery({ persistence, edgeType, nodeId: to, side: 'i', amount })
  return Promise.all([qin, qout])
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
