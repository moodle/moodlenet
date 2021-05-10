import { IDScalarType } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { parseNodeId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { SignOptions } from 'jsonwebtoken'
import { JwtPrivateKey, signJwtActiveUser } from '../../adapters/lib/auth/jwt'
import { getSessionExecutionContext } from '../../adapters/lib/auth/types'
import { userSessionByActiveUser } from '../../adapters/user-auth/arangodb/helpers'
import { resolve } from '../../lib/qmino'
import { newUserConfirm, signUp } from '../../ports/mutations/user-auth/new-user'
import { byId } from '../../ports/queries/content-graph/get-content-node'
import { search } from '../../ports/queries/content-graph/global-search'
import { getByUsername } from '../../ports/queries/user-auth/session'
import * as GQL from '../types.graphql.gen'
import { fakeNodeByShallowOrDoc } from './helpers'

export const getGQLResolvers = ({
  jwtPrivateKey,
  jwtSignOptions,
}: {
  jwtSignOptions: SignOptions
  jwtPrivateKey: JwtPrivateKey
}): GQL.Resolvers => {
  return {
    //@ts-expect-error : Scalar ID is not present in Resolvers
    ID: IDScalarType,
    Query: {
      async node(_root, { id }, ctx /* ,_info */) {
        const { nodeType, _key } = parseNodeId(id)
        const maybeNode = await resolve(byId({ _key, ctx, nodeType }))()
        return maybeNode && fakeNodeByShallowOrDoc(maybeNode)
      },

      async globalSearch(_root, { sortBy, text, nodeTypes, page }, ctx) {
        return resolve(search({ sortBy, text, nodeTypes, page, ctx }))()
      },

      async getSession(_root, {}, ctx) {
        const sessionCtx = getSessionExecutionContext(ctx)
        if (!sessionCtx) {
          return null
        }
        const { username } = sessionCtx
        const activeUser = await resolve(getByUsername({ username, matchPassword: false }))()

        if (!activeUser) {
          return null
        }
        return userSessionByActiveUser({ activeUser })
      },
    },
    Mutation: {
      async createSession(_root, { password, username } /* , ctx */) {
        const activeUser = await resolve(getByUsername({ username, matchPassword: password }))()

        if (!activeUser) {
          return {
            __typename: 'CreateSession',
            message: 'not found',
          }
        }
        const jwt = signJwtActiveUser({ jwtPrivateKey, jwtSignOptions, user: activeUser })
        return {
          __typename: 'CreateSession',
          jwt,
        }
      },
      async signUp(_root, { email } /* ,ctx */) {
        const res = await resolve(signUp({ email }))()
        if (typeof res === 'string') {
          return { __typename: 'SimpleResponse', success: false, message: res }
        }
        return { __typename: 'SimpleResponse', success: true }
      },
      async activateUser(_root, { password, token, username } /*, ctx */) {
        const activationresult = await resolve(newUserConfirm({ password, token, username }))()
        if ('string' === typeof activationresult) {
          return {
            __typename: 'CreateSession',
            jwt: null,
            message: activationresult,
          }
        }
        const jwt = signJwtActiveUser({ user: activationresult, jwtPrivateKey, jwtSignOptions })
        return {
          __typename: 'CreateSession',
          jwt,
        }
      },
    },
  }
}
