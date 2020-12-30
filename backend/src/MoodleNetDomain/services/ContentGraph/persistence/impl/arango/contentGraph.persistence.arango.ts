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
      __typename: T['__typename'] | false
    }): ResolverFn<any, { _id: string }, any, any> => async (
      parent /* ,variables, ctx, info */
    ) => {
      const { __typename, collection, reverse, depth = [1, 1] } = _
      const { _id: vertexId } = parent
      console.log(parent)
      const dir = reverse ? 'INBOUND' : 'OUTBOUND'
      const q = `
        FOR v, e IN ${depth.join('..')}  ${dir} "${vertexId}" ${collection.name}
          ${__typename ? `FILTER e.__typename == "${__typename}"` : ''}
          RETURN  MERGE (e, {
            node: ${reverse ? '{ _id: e._to }' : 'DOCUMENT(e._to)'}
          })
      `
      console.log(q)
      const cursor = await db.query(q)

      const edges = await cursor.map((edge) => ({
        ...edge,
        cursor: '#',
      }))

      console.log(edges, cursor)
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
            reverse: true,
            __typename: 'UserFollowsUser',
            // FIXME: many
            // __typenames: ['UserFollowsUser'],
          }),
          followsSubjects: edgesResolver({
            collection: FollowsEdges,
            __typename: 'UserFollowsSubject',
          }),
          followsUsers: edgesResolver({
            collection: FollowsEdges,
            __typename: 'UserFollowsUser',
          }),
        },

        //@ts-ignore
        Subject: {
          followers: edgesResolver({
            collection: FollowsEdges,
            reverse: true,
            __typename: 'UserFollowsSubject',
          }),
        },
      },
    }
    return engine
  }
)
