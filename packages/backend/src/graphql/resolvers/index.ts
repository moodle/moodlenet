import { validateCreateEdgeInput } from '@moodlenet/common/lib/graphql/content-graph/inputStaticValidation/createEdge'
import { validateCreateNodeInput } from '@moodlenet/common/lib/graphql/content-graph/inputStaticValidation/createNode'
import { IDScalarType } from '@moodlenet/common/lib/graphql/scalars.graphql'
import * as GQLTypes from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { parseNodeId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { SignOptions } from 'jsonwebtoken'
import { userSessionByActiveUser } from '../../adapters/user-auth/arangodb/helpers'
import { JwtPrivateKey, signJwtActiveUser } from '../../lib/auth/jwt'
import { QMino } from '../../lib/qmino'
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
  qmino,
}: {
  jwtSignOptions: SignOptions
  jwtPrivateKey: JwtPrivateKey
  qmino: QMino
}): GQLResolvers.Resolvers => {
  return {
    //@ts-expect-error : Scalar ID is not present in Resolvers
    ID: IDScalarType,
    Query: {
      async node(_root, { id } /* ,env ,_info */) {
        const { nodeType, _key } = parseNodeId(id)
        const maybeNode = await qmino.query(nodePorts.byId({ _key, nodeType }), { timeout: 5000 })
        return maybeNode && fakeNodeByShallowOrDoc(maybeNode)
      },

      async globalSearch(_root, { sortBy, text, nodeTypes, page }, env) {
        return qmino.query(searchPorts.byTerm({ sortBy, text, nodeTypes, page, env }), { timeout: 5000 })
      },

      async getSession(_root, _no_args, env) {
        const activeUser = await qmino.query(
          userPorts.getActiveByUsername({ username: env.user.name, matchPassword: false }),
          { timeout: 5000 },
        )

        if (!activeUser) {
          return null
        }
        return userSessionByActiveUser({ activeUser })
      },
    },
    Mutation: {
      async createSession(_root, { password, username } /* , env */) {
        const activeUser = await qmino.query(userPorts.getActiveByUsername({ username, matchPassword: password }), {
          timeout: 5000,
        })

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

      async signUp(_root, { email } /* ,env */) {
        const res = await qmino.callSync(newUserPorts.signUp({ email }), { timeout: 5000 })
        if (typeof res === 'string') {
          return { __typename: 'SimpleResponse', success: false, message: res }
        }
        return { __typename: 'SimpleResponse', success: true }
      },

      async activateUser(_root, { password, token, username } /*, env */) {
        const activationresult = await qmino.callSync(newUserPorts.confirmSignup({ password, token, username }), {
          timeout: 5000,
        })
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

      async createNode(_root, { input }, env, _info) {
        const { nodeType } = input
        // if (env.type === 'anon') {
        //   return createNodeMutationError('NotAuthorized')
        // }

        const nodeInput = validateCreateNodeInput(input)
        if (nodeInput instanceof Error) {
          return createNodeMutationError('UnexpectedInput', nodeInput.message)
        }

        const data = await bakeNodeDoumentData(nodeInput, nodeType, qmino)
        if ('__typename' in data) {
          return data
        }

        // const data = { name, summary, ...assetRefMap }
        const shallowNodeOrError = await qmino.callSync(
          nodePorts.create({
            data,
            nodeType,
            env,
          }),
          { timeout: 5000 },
        )
        if (typeof shallowNodeOrError === 'string') {
          return createNodeMutationError(shallowNodeOrError, '')
        }
        const successResult: GQLTypes.CreateNodeMutationSuccess = {
          __typename: 'CreateNodeMutationSuccess',
          node: fakeNodeByShallowOrDoc(shallowNodeOrError),
        }

        return successResult
      },

      async createEdge(_root, { input }, env, _info) {
        // if (env.type === 'anon') {
        //   return createEdgeMutationError('NotAuthorized')
        // }
        const { edgeType, from, to } = input
        const data = validateCreateEdgeInput(input)
        if (data instanceof Error) {
          return createEdgeMutationError('UnexpectedInput', data.message)
        }

        // const data = { name, summary, ...assetRefMap }
        const edgeCreateResult = await qmino.callSync(
          edgePorts.create({
            from,
            to,
            data,
            edgeType,
            env,
          }),
          { timeout: 5000 },
        )
        if (typeof edgeCreateResult === 'string') {
          return createEdgeMutationError(edgeCreateResult, '')
        }
        const successResult: GQLTypes.CreateEdgeMutationSuccess = {
          __typename: 'CreateEdgeMutationSuccess',
          edge: fakeEdgeByShallowOrDoc(edgeCreateResult),
        }

        return successResult
      },

      async deleteEdge(_root, { input }, env /*,  _info */) {
        // console.log('deleteEdge', input)
        const { edgeType, id } = input

        const deleteResult = await qmino.callSync(
          edgePorts.del({
            env,
            edgeType,
            id,
          }),
          { timeout: 5000 },
        )

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
