import { Maybe } from 'graphql/jsutils/Maybe'
import { aqlstr } from '../../../../../../../lib/helpers/arango'
import { Page, PaginationInput } from '../../../../ContentGraph.graphql.gen'
import { Types } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
const DEFAULT_PAGE_LENGTH = 10
const MAX_PAGE_LENGTH = 25

export const cursorPaginatedQuery = async <P extends Page>({
  page,
  cursorProp,
  mapQuery,
  pageEdgeTypename,
  pageTypename,
  inverseSort = false,
}: {
  page: Maybe<PaginationInput>
  cursorProp: string
  inverseSort?: boolean
  mapQuery(pageFilterSort: string): string
  //@ts-expect-error
  pageTypename: P['__typename']
  //@ts-expect-error
  pageEdgeTypename: P['edges'][number]['__typename']
}): Promise<P> => {
  const { db } = await DBReady()

  const { after, first, last, before } = {
    ...page,
    last: page?.last ?? 0,
    first: page?.first ?? DEFAULT_PAGE_LENGTH,
  }
  const beforeCursor = before || after
  const getCursorToo = beforeCursor === after

  const pageLimit = (_: number, includeCursor: boolean) =>
    Math.min(_ || Infinity, MAX_PAGE_LENGTH) + (includeCursor && getCursorToo ? 1 : 0)

  const afterPage =
    !after && !!before
      ? null
      : `${after ? `FILTER ${cursorProp} > ${aqlstr(after)}` : ``}
    SORT ${cursorProp} ${inverseSort ? 'DESC' : 'ASC'}
    LIMIT ${pageLimit(first, false)}
    LET cursor = ${cursorProp}
    `

  const comparison = getCursorToo ? '<=' : '<'
  const beforePage =
    last && beforeCursor
      ? `${beforeCursor ? `FILTER ${cursorProp} ${comparison} ${aqlstr(beforeCursor)}"` : ``}
        SORT ${cursorProp} ${inverseSort ? 'ASC' : 'DESC'}
        LIMIT ${pageLimit(last, true)}
        LET cursor = ${cursorProp}
      `
      : ``
  return Promise.all(
    [afterPage, beforePage].map(pageFilterSort => {
      const q = pageFilterSort ? mapQuery(pageFilterSort) : null

      console.log(q)
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
  //@ts-expect-error
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

export const skipLimitPagination = ({ page }: { page: Maybe<PaginationInput> }) => {
  const { after, first } = {
    ...page,
    first: page?.first ?? DEFAULT_PAGE_LENGTH,
  }
  const limit = Math.min(first, MAX_PAGE_LENGTH)
  const skip = Number(after || -1) + 1
  return {
    limit,
    skip,
  }
}

export const aqlMergeTypenameById = (varname: string) =>
  `MERGE( ${varname}, { __typename: PARSE_IDENTIFIER(${varname}._id).collection } )`
