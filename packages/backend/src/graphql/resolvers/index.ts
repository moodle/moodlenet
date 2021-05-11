import { validateCreateEdgeInput } from '@moodlenet/common/lib/graphql/content-graph/inputStaticValidation/createEdge'
import { validateCreateNodeInput } from '@moodlenet/common/lib/graphql/content-graph/inputStaticValidation/createNode'
import { IDScalarType } from '@moodlenet/common/lib/graphql/scalars.graphql'
import * as GQLTypes from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { parseNodeId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { SignOptions } from 'jsonwebtoken'
import { userSessionByActiveUser } from '../../adapters/user-auth/arangodb/helpers'
import { JwtPrivateKey, signJwtActiveUser } from '../../lib/auth/jwt'
import { getSessionExecutionContext } from '../../lib/auth/types'
import { resolve } from '../../lib/qmino'
import * as edgePorts from '../../ports/content-graph/edge'
import * as nodePorts from '../../ports/content-graph/node'
import * as searchPorts from '../../ports/content-graph/search'
import * as newUserPorts from '../../ports/user-auth/new-user'
import * as userPorts from '../../ports/user-auth/user'
import * as GQLResolvers from '../types.graphql.gen'
import {
  createEdgeMutationError,
  createNodeMutationError,
  deleteEdgeMutationError,
  fakeEdgeByShallowOrDoc,
  fakeNodeByShallowOrDoc,
} from './helpers'
import { bakeNodeDoumentData } from './prepareData/createNode'

export const getGQLResolvers = ({
  jwtPrivateKey,
  jwtSignOptions,
}: {
  jwtSignOptions: SignOptions
  jwtPrivateKey: JwtPrivateKey
}): GQLResolvers.Resolvers => {
  return {
    //@ts-expect-error : Scalar ID is not present in Resolvers
    ID: IDScalarType,
    Query: {
      async node(_root, { id }, ctx /* ,_info */) {
        const { nodeType, _key } = parseNodeId(id)
        const maybeNode = await resolve(nodePorts.byId({ _key, ctx, nodeType }))()
        return maybeNode && fakeNodeByShallowOrDoc(maybeNode)
      },

      async globalSearch(_root, { sortBy, text, nodeTypes, page }, ctx) {
        return resolve(searchPorts.byTerm({ sortBy, text, nodeTypes, page, ctx }))()
      },

      async getSession(_root, {}, ctx) {
        const sessionCtx = getSessionExecutionContext(ctx)
        if (!sessionCtx) {
          return null
        }
        const { username } = sessionCtx
        const activeUser = await resolve(userPorts.getActiveByUsername({ username, matchPassword: false }))()

        if (!activeUser) {
          return null
        }
        return userSessionByActiveUser({ activeUser })
      },
    },
    Mutation: {
      async createSession(_root, { password, username } /* , ctx */) {
        const activeUser = await resolve(userPorts.getActiveByUsername({ username, matchPassword: password }))()

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
        const res = await resolve(newUserPorts.signUp({ email }))()
        if (typeof res === 'string') {
          return { __typename: 'SimpleResponse', success: false, message: res }
        }
        return { __typename: 'SimpleResponse', success: true }
      },

      async activateUser(_root, { password, token, username } /*, ctx */) {
        const activationresult = await resolve(newUserPorts.confirmSignup({ password, token, username }))()
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

      async createNode(_root, { input }, ctx, _info) {
        const { nodeType } = input
        // if (ctx.type === 'anon') {
        //   return createNodeMutationError('NotAuthorized')
        // }

        const nodeInput = validateCreateNodeInput(input)
        if (nodeInput instanceof Error) {
          return createNodeMutationError('UnexpectedInput', nodeInput.message)
        }

        const data = await bakeNodeDoumentData(nodeInput, nodeType)
        if ('__typename' in data) {
          return data
        }

        // const data = { name, summary, ...assetRefMap }
        const shallowNodeOrError = await resolve(
          nodePorts.create({
            data,
            nodeType,
            ctx,
          }),
        )()
        if (typeof shallowNodeOrError === 'string') {
          return createNodeMutationError(shallowNodeOrError, '')
        }
        const successResult: GQLTypes.CreateNodeMutationSuccess = {
          __typename: 'CreateNodeMutationSuccess',
          node: fakeNodeByShallowOrDoc(shallowNodeOrError),
        }

        return successResult
      },

      async createEdge(_root, { input }, ctx, _info) {
        // if (ctx.type === 'anon') {
        //   return createEdgeMutationError('NotAuthorized')
        // }
        const { edgeType, from, to } = input
        const data = validateCreateEdgeInput(input)
        if (data instanceof Error) {
          return createEdgeMutationError('UnexpectedInput', data.message)
        }

        // const data = { name, summary, ...assetRefMap }
        const edgeCreateResult = await resolve(
          edgePorts.create({
            from,
            to,
            data,
            edgeType,
            ctx,
          }),
        )()
        if (typeof edgeCreateResult === 'string') {
          return createEdgeMutationError(edgeCreateResult, '')
        }
        const successResult: GQLTypes.CreateEdgeMutationSuccess = {
          __typename: 'CreateEdgeMutationSuccess',
          edge: fakeEdgeByShallowOrDoc(edgeCreateResult),
        }

        return successResult
      },

      async deleteEdge(_root, { input }, ctx /*,  _info */) {
        // console.log('deleteEdge', input)
        const { edgeType, id } = input
        if (ctx.type === 'anon') {
          return deleteEdgeMutationError('NotAuthorized', `Anonymous can't delete`)
        }

        const deleteResult = await resolve(
          edgePorts.del({
            ctx,
            edgeType,
            id,
          }),
        )()

        if (typeof deleteResult === 'string') {
          return deleteEdgeMutationError(deleteResult, null)
        }
        const successResult: GQLTypes.DeleteEdgeMutationSuccess = {
          __typename: 'DeleteEdgeMutationSuccess',
          edgeId: id,
        }

        return successResult
      },
    },
  }
}
