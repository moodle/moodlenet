import { Maybe } from 'graphql/jsutils/Maybe'
import { aqlstr } from '../../../../../../../lib/helpers/arango'
import { Page, PaginationInput } from '../../../../ContentGraph.graphql.gen'
import { Types } from '../../../types'
import { DBReady } from '../ContentGraph.persistence.arango.env'
const DEFAULT_PAGE_LENGTH = 10

export const paginatedQuery = async <P extends Page>({
  page,
  cursorProp,
  mapQuery,
  pageEdgeTypename,
  pageTypename,
}: {
  page: Maybe<PaginationInput>
  cursorProp: string
  mapQuery(pageFilterSort: string): string
  //@ts-expect-error
  pageTypename: P['__typename']
  //@ts-expect-error
  pageEdgeTypename: P['edges'][number]['__typename']
}): Promise<P> => {
  const { db } = await DBReady()

  const { after, first, last, before } = {
    last: 0,
    first: DEFAULT_PAGE_LENGTH,
    ...page,
  }
  const beforeCursor = before || after
  const getCursorToo = beforeCursor === after

  const pageLimit = (_: number | null, includeCursor: boolean) =>
    Math.min(_ || Infinity, DEFAULT_PAGE_LENGTH) + (includeCursor && getCursorToo ? 1 : 0)

  const afterPage =
    !after && !!before
      ? null
      : `${after ? `FILTER ${cursorProp} > ${aqlstr(after)}` : ``}
    SORT ${cursorProp}
    LIMIT ${pageLimit(first, false)}
    LET cursor = ${cursorProp}
    `

  const comparison = getCursorToo ? '<=' : '<'
  const beforePage =
    last && beforeCursor
      ? `${beforeCursor ? `FILTER ${cursorProp} ${comparison} ${aqlstr(beforeCursor)}"` : ``}
        SORT ${cursorProp} DESC
        LIMIT ${pageLimit(last, true)}
        LET cursor = ${cursorProp}
      `
      : ``
  return Promise.all(
    [afterPage, beforePage].map(page => {
      const q = page ? mapQuery(page) : null

      // console.log(q)
      return q ? db.query(q).then(cursor => cursor.all()) : []
    }),
  ).then(([afterEdges, beforeEdges]) => {
    const edges: P['edges'] = beforeEdges
      .reverse()
      .concat(afterEdges)
      .map(_ => ({ ..._, __typename: pageEdgeTypename }))
    const pageInfo: Types.PageInfo = {
      startCursor: edges[0]?.cursor ?? null,
      endCursor: edges[edges.length - 1]?.cursor ?? null,
      hasNextPage: true,
      hasPreviousPage: false,
      __typename: 'PageInfo',
    }
    const page = ({
      __typename: pageTypename,
      pageInfo,
      edges,
    } as any) as P
    return page
  })
}

export const aqlMergeTypenameById = (varname: string) => `
MERGE( 
  ${varname},
  {
    __typename: PARSE_IDENTIFIER(${varname}._id).collection
  }
  )
`
