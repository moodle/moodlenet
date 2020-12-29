import { EdgeCollection } from 'arangojs/collection'
import {
  RelayPageInfo,
  ResolverFn,
} from '../../../graphql/ContentGraph.graphql.gen'
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
      dir: 'OUTBOUND' | 'INBOUND' | 'ANY'
      depth?: [number, number]
      __typename: T['__typename'] | false
    }): ResolverFn<any, { _id: string }, any, any> => async (
      parent /* ,variables, ctx, info */
    ) => {
      const { __typename, collection, dir, depth = [1, 1] } = _
      const { _id: vertexId } = parent
      const getFrom = dir === 'INBOUND' || dir === 'ANY'
      const getTo = dir === 'OUTBOUND' || dir === 'ANY'
      console.log(parent)
      const q = `
        FOR v, e IN ${depth.join('..')}  ${dir} "${vertexId}" ${collection.name}
          ${__typename ? `FILTER e.__typename == "${__typename}"` : ''}
          LET node = MERGE(e, {
            _from: ${getFrom ? 'DOCUMENT(e._from)' : '{ _id: e._from }'},
            _to : ${getTo ? 'DOCUMENT(e._to)' : '{ _id: e._to }'}
          })
          RETURN {
            cursor: 'xx',
            node
          }
      `
      console.log(q)
      const cursor = await db.query(q)
      const edges = await cursor.all()
      cursor.kill()
      console.log(edges)
      const pageInfo: RelayPageInfo = {
        endCursor: 'endCursor',
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'startCursor',
        __typename: 'RelayPageInfo',
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
            dir: 'INBOUND',
            __typename: 'UserFollowsUser',
            // FIXME: many
            // __typenames: ['UserFollowsUser'],
          }),
          followsSubjects: edgesResolver({
            collection: FollowsEdges,
            dir: 'OUTBOUND',
            __typename: 'UserFollowsSubject',
          }),
          followsUsers: edgesResolver({
            collection: FollowsEdges,
            dir: 'OUTBOUND',
            __typename: 'UserFollowsUser',
          }),
        },

        //@ts-ignore
        Subject: {
          followers: edgesResolver({
            collection: FollowsEdges,
            dir: 'INBOUND',
            __typename: 'UserFollowsSubject',
          }),
        },
      },
    }
    return engine
  }
)
