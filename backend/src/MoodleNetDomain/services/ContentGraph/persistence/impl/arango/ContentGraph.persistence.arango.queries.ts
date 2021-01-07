import { Database } from 'arangojs'
import { EdgeCollection } from 'arangojs/collection'
import { getDocumentById } from '../../../../../../lib/helpers/arango'
import { Maybe } from '../../../../../../lib/helpers/types'
import {
  GraphEdge,
  PageInfo,
  PageInput,
  ResolverFn,
} from '../../../ContentGraph.graphql.gen'

const DEFAULT_PAGE_LENGTH = 10

export const vertexResolver = ({
  db,
}: {
  db: Database
}): ResolverFn<any, any, any, { _id: string }> => async (
  _parent,
  variables
  /* 
      ctx,
      info
      */
) => getDocumentById({ sel: variables, db })

export const edgesResolver = <T extends { __typename: string }>(_: {
  db: Database
  collection: EdgeCollection<T>
  reverse?: boolean
  depth?: [number, number]
  typenames: T['__typename'][]
  mainSortProp?: string
}): ResolverFn<
  any,
  { _id: string },
  any,
  { page?: Maybe<PageInput> }
> => async (parent, { page } /*, ctx, info */) => {
  console.log(parent)
  const {
    db,
    typenames,
    collection: edgeCollection,
    reverse,
    depth = [1, 1],
    mainSortProp = '_id',
  } = _

  const typenamesFilter = typenames.reduce(
    (filter, typename) =>
      `${filter}${filter ? ` ||` : `FILTER`} edge.__typename == "${typename}"`,
    ``
  )
  const { _id: parentVertexId } = parent
  const { after, first, last, before } = {
    last: 0,
    first: DEFAULT_PAGE_LENGTH,
    before: page?.after,
    ...page,
  }
  const afterPage = `${after ? `FILTER node.${mainSortProp} > "${after}"` : ``}
    SORT node.${mainSortProp}
    LIMIT ${Math.min(first || 0, DEFAULT_PAGE_LENGTH)}`

  const beforeCurs = before || after
  const getCursorToo = beforeCurs === after
  const comparison = getCursorToo ? '<=' : '<'
  const beforePage =
    last && beforeCurs
      ? `${
          beforeCurs
            ? `FILTER node.${mainSortProp} ${comparison} "${beforeCurs}"`
            : ``
        }
        SORT node.${mainSortProp} DESC
        LIMIT ${Math.min(last, DEFAULT_PAGE_LENGTH) + (getCursorToo ? 1 : 0)}`
      : ``
  return Promise.all(
    [afterPage, beforePage].map((page) => {
      const q = page
        ? `
        FOR v, edge 
          IN ${depth.join('..')} 
          ${reverse ? 'INBOUND' : 'OUTBOUND'} 
          "${parentVertexId}" 
          ${edgeCollection.name}
          ${typenamesFilter}
          
          LET node = DOCUMENT(edge.${reverse ? '_from' : '_to'})
          ${page}

            RETURN  {
              edge,
              node
            }
      `
        : null

      console.log(q)
      return q
        ? db.query(q).then((cursor) =>
            cursor.map<GraphEdge>(({ edge, node }) => ({
              ...edge,
              node,
              cursor: node[mainSortProp],
            }))
          )
        : []
    })
  ).then(([afterEdges, beforeEdges]) => {
    const edges = beforeEdges.reverse().concat(afterEdges)
    const pageInfo: PageInfo = {
      endCursor: edges[edges.length - 1]?.node._id,
      hasNextPage: true,
      hasPreviousPage: false,
      startCursor: edges[0]?.node._id,
      __typename: 'PageInfo',
    }
    return {
      pageInfo,
      edges,
    }
  })
}
