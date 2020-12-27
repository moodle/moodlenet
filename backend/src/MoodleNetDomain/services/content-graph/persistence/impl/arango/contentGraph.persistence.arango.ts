import { EdgeCollection } from 'arangojs/collection'
import { ResolverFn } from '../../../graphql/content-graph.graphql.gen'
import { ContentGraphEngine } from '../../types'
import { DBReady } from './contentGraph.persistence.arango.env'

export const arangoContentGraphEngine: Promise<ContentGraphEngine> = DBReady.then(
  ({ db, /* SubjectVertices, UserVertices, */ FollowsEdges }) => {
    const vertexById = async (_: { _id: string }) => {
      const { _id } = _
      const q = `
        RETURN DOCUMENT("${_id}")
      `
      console.log(q)
      const qresp = await db.query(q)
      return qresp.next()
    }

    const vertexResolver: ResolverFn<any, any, any, { _id: string }> = (
      _par,
      { _id }
    ) => vertexById({ _id })

    const edgeVertexResolver = (_: {
      side: '_from' | '_to'
    }): ResolverFn<any, { _from: any; _to: any }, any, any> => (par) =>
      vertexById({ _id: par[_.side] })

    const edgesResolver = <T extends { __typename: string }>(_: {
      collection: EdgeCollection<T>
      dir: 'OUTBOUND' | 'INBOUND' | 'ANY'
      depth?: [number, number]
      __typename: T['__typename'] | false
    }): ResolverFn<any, { _id: string }, any, any> => async (
      p /* , a, c, i */
    ) => {
      const { __typename, collection, dir, depth = [1, 1] } = _
      const { _id: parentId } = p
      console.log(p)
      // const parentId = `${collection}/${_key}`
      const q = `
        FOR v, e IN ${depth.join('..')}  ${dir} "${parentId}" ${collection.name}
          ${__typename ? `FILTER e.__typename == "${__typename}"` : ''}
          RETURN MERGE( {
            _from: { _id: e._from },
            _to: { _id: e._to },
          }, e)
      `
      console.log(q)
      const queryResult = await db.query(q)
      const edges = await queryResult.all()
      console.log(edges)
      return edges
    }

    const edgeSidesResolver = {
      _from: edgeVertexResolver({ side: '_from' }),
      _to: edgeVertexResolver({ side: '_to' }),
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
        UserFollowsUser: edgeSidesResolver,

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
