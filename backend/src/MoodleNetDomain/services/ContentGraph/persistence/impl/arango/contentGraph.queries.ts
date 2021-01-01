import { Database } from 'arangojs'
import { EdgeCollection } from 'arangojs/collection'
import { PageInfo, ResolverFn } from '../../../ContentGraph.graphql.gen'

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
) => {
  const { _id } = variables
  const q = `
        RETURN DOCUMENT("${_id}")
      `
  console.log(q)
  const cursor = await db.query(q)
  const resp = await cursor.next()
  cursor.kill()
  return resp
}

export const edgesResolver = <T extends { __typename: string }>(_: {
  db: Database
  collection: EdgeCollection<T>
  reverse?: boolean
  depth?: [number, number]
  typenames: T['__typename'][]
}): ResolverFn<any, { _id: string }, any, any> => async (
  parent /* ,variables, ctx, info */
) => {
  const {
    db,
    typenames,
    collection: edgeCollection,
    reverse,
    depth = [1, 1],
  } = _
  const typenamesFilter = typenames.reduce(
    (filter, typename) =>
      `${filter}${filter ? ` ||` : `FILTER`} edge.__typename == "${typename}"`,
    ``
  )
  const { _id: parentVertexId } = parent
  console.log(parent)
  const q = `
        FOR v, edge 
          IN ${depth.join('..')} 
          ${reverse ? 'INBOUND' : 'OUTBOUND'} 
          "${parentVertexId}" 
          ${edgeCollection.name}
          ${typenamesFilter}
          
            LET node = DOCUMENT(edge.${reverse ? '_from' : '_to'})

            RETURN  {
              edge,
              node
            }
      `
  console.log(q)
  const cursor = await db.query(q)

  const edges = await cursor.map(({ edge, node }) => ({
    ...edge,
    node,
    cursor: '#',
  }))

  console.log(edges)
  const pageInfo: PageInfo = {
    endCursor: 'endCursor',
    hasNextPage: true,
    hasPreviousPage: false,
    startCursor: 'startCursor',
    __typename: 'PageInfo',
  }
  return {
    pageInfo,
    edges,
  }
}
