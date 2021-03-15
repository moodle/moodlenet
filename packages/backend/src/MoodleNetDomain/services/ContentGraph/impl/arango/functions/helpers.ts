import { parseNodeId } from '@moodlenet/common/lib/utils/content-graph'
import { Maybe } from 'graphql/jsutils/Maybe'
import { aqlstr } from '../../../../../../lib/helpers/arango'
import { Id } from '../../../../UserAccount/types'
import { EdgeType, Page, PaginationInput } from '../../../ContentGraph.graphql.gen'
import { Types } from '../../../types.node'
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
    [afterPage, beforePage].map(pageFilterSortLimit => {
      const q = pageFilterSortLimit
        ? mapQuery(`
        ${pageFilterSortLimit}
        LET cursor = ${cursorProp}
      `)
        : null

      // console.log(q)
      return q ? db.query(q).then(cursor => cursor.all()) : []
    }),
  ).then(([afterEdges, beforeEdges]) => makePage<P>({ afterEdges, beforeEdges, pageEdgeTypename, pageTypename }))
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
  const pageInfo: Types.PageInfo = {
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

export const aqlMergeTypenameById = (varname: string) =>
  `MERGE( ${varname}, { __typename: PARSE_IDENTIFIER(${varname}._id).collection } )`

export const createNodeMetaString = ({}: {}) => `{
    created: DATE_NOW(),
    updated: DATE_NOW()
  }
`
export const updateNodeMetaString = ({}: {}) => `{
  updated: DATE_NOW()
}
`

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
      LET currRelCount = v.${NODE_META_PROP}.relCount.${edgeType}.${side} || 0
      UPDATE v WITH ${mergeNodeMeta({
        nodeProp: 'v',
        mergeMeta: `{
          relCount: {
            ${edgeType} : {
              ${side}: currRelCount + (${Math.floor(amount)})
            }
          }
        }`,
      })}

      IN ${nodeType} 
      
      RETURN NEW
  `
  // console.log(q)
  const cursor = await db.query(q)
  const res = await cursor.next()
  cursor.kill()
  return res
}

export const mergeNodeMeta = ({ mergeMeta, nodeProp }: { mergeMeta: string; nodeProp: string }) =>
  `MERGE_RECURSIVE(${nodeProp},{ ${NODE_META_PROP}: ${mergeMeta} })`

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

const NODE_META_PROP = '_meta'
