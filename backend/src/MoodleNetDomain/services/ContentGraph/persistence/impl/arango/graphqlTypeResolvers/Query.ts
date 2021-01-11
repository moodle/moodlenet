import { Resolvers, User } from '../../../../ContentGraph.graphql.gen'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import { vertexResolver } from '../ContentGraph.persistence.arango.queries'

export const Query = DBReady.then<Resolvers['Query']>(
  ({ db, UserVertices }) => ({
    user: vertexResolver({ db }),
    subject: vertexResolver({ db }),
    collection: vertexResolver({ db }),
    resource: vertexResolver({ db }),
    async getSessionAccountUser(_parent, { username }) {
      const mUser = await UserVertices.document(username)
      if (!mUser) {
        throw new Error(`No Account User found`)
      }
      const user = (mUser as any) as User
      return { __typename: 'SessionAccount', user, username }
    },
  })
)
