import { EdgeCollection } from 'arangojs/collection'
import { PageInfo, ResolverFn } from '../../../graphql/ContentGraph.graphql.gen'
import { ContentGraphEngine } from '../../types'
import { DBReady } from './contentGraph.persistence.arango.env'

export const arangoContentGraphEngine: Promise<ContentGraphEngine> = DBReady.then(
  ({ db, /* SubjectVertices, UserVertices, */ FollowsEdges }) => {
    const vertexResolver: ResolverFn<any, any, any, { _id: string }> = async (
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

    const edgesResolver = <T extends { __typename: string }>(_: {
      collection: EdgeCollection<T>
      reverse?: boolean
      depth?: [number, number]
      typenames: T['__typename'][]
    }): ResolverFn<any, { _id: string }, any, any> => async (
      parent /* ,variables, ctx, info */
    ) => {
      const {
        typenames,
        collection: edgeCollection,
        reverse,
        depth = [1, 1],
      } = _
      const typenamesFilter = typenames.reduce(
        (filter, typename) =>
          `${filter}${
            filter ? ` ||` : `FILTER`
          } edge.__typename == "${typename}"`,
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

    const engine: ContentGraphEngine = {
      graphQLResolvers: {
        Query: {
          user: vertexResolver,
          subject: vertexResolver,
        },
        //@ts-ignore
        User: {
          followers: edgesResolver({
            collection: FollowsEdges,
            typenames: ['UserFollowsUser'],
            reverse: true,
          }),
          followsSubjects: edgesResolver({
            collection: FollowsEdges,
            typenames: ['UserFollowsSubject'],
          }),
          followsUsers: edgesResolver({
            collection: FollowsEdges,
            typenames: ['UserFollowsUser'],
          }),
        },

        //@ts-ignore
        Subject: {
          followers: edgesResolver({
            collection: FollowsEdges,
            typenames: ['UserFollowsSubject'],
            reverse: true,
          }),
        },
      },
    }
    return engine
  }
)
