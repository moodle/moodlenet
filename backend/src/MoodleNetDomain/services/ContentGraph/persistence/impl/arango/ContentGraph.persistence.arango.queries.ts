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
import { GlyphEdge } from '../../glyph'
import { CreateRelationEdgeErrorMsg } from '../../types'

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

export const createRelationEdge = async <Edge extends GlyphEdge>({
  db,
  _from,
  _to,
  edgeCollectionName,
  graphName,
  data,
  reverse = false,
  allowMultipleOnSameVertex = false,
  allowSelf = false,
}: {
  db: Database
  graphName: string
  _from: string
  _to: string
  edgeCollectionName: string
  data: Omit<Edge, '_id' | 'node'>
  reverse?: boolean
  allowMultipleOnSameVertex?: boolean
  allowSelf?: boolean
}): Promise<Edge | CreateRelationEdgeErrorMsg> => {
  console.log({
    _from,
    _to,
    edgeCollectionName,
    data,
  })

  if (!allowSelf && _from === _to) {
    return 'no-self'
  } else if (!allowMultipleOnSameVertex) {
    const existingRelation = await getExistingRelation()

    if (existingRelation) {
      return {
        ...existingRelation,
        node: reverse ? existingRelation.from : existingRelation.to,
      }
    } else {
      return createNewRelationEdge()
    }
  } else {
    return createNewRelationEdge()
  }

  function createNewRelationEdge(): Promise<Edge> {
    const coll = db.graph(graphName).edgeCollection(edgeCollectionName)

    return Promise.all([
      coll.save(data, { returnNew: true }),
      db
        .query(`RETURN DOCUMENT("${reverse ? _from : _to}")`)
        .then((c) => c.next()),
    ])
      .then(([{ new: newEdge }, node]) => ({
        ...newEdge,
        node,
      }))
      .catch<CreateRelationEdgeErrorMsg>((_err) => {
        console.log(String(_err))
        // TODO: parse error and return correct msg
        return 'some-vertex-not-found'
      })
  }
  function getExistingRelation() {
    return getRelationEdge({
      db,
      edgeCollectionName,
      _from,
      _to,
      fetchNodes: reverse ? 'from' : 'to',
    })
  }
}
export const getRelationEdge = async ({
  db,
  _from,
  _to,
  edgeCollectionName,
  fetchNodes,
}: {
  db: Database
  _from: string
  _to: string
  edgeCollectionName: string
  fetchNodes: 'to' | 'from' | 'both' | 'none'
}) =>
  (
    await db.query(`
          FOR e in ${edgeCollectionName} 
            FILTER e._to=="${_to}"
              && e._from=="${_from}"
            LIMIT 1 
            RETURN MERGE(e, {
              from: ${
                fetchNodes === 'both' || fetchNodes === 'from'
                  ? `DOCUMENT(e._from)`
                  : '{_id: e._from}'
              },
              to: ${
                fetchNodes === 'both' || fetchNodes === 'to'
                  ? `DOCUMENT(e._to)`
                  : '{_id: e._to}'
              } 
            })`)
  ).next()
