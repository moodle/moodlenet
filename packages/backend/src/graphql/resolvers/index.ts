import { globalSearchNodeTypes, isGlobalSearchNodeType } from '@moodlenet/common/lib/content-graph/types/global-search'
import { validateCreateEdgeInput } from '@moodlenet/common/lib/graphql/content-graph/inputStaticValidation/createEdge'
import { validateCreateNodeInput } from '@moodlenet/common/lib/graphql/content-graph/inputStaticValidation/createNode'
import { validateEditNodeInput } from '@moodlenet/common/lib/graphql/content-graph/inputStaticValidation/editNode'
import * as GQLTypes from '@moodlenet/common/lib/graphql/types.graphql.gen'
import {
  gqlEdgeId2GraphEdgeIdentifier,
  gqlNodeId2GraphNodeIdentifier,
  gqlNodeId2GraphNodeIdentifierOfType,
} from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import * as contentGraph from '../../ports/content-graph'
import * as userAuth from '../../ports/user-auth'
import * as GQLResolvers from '../types.graphql.gen'
import {
  createEdgeMutationError,
  createNodeMutationError,
  deleteEdgeMutationError,
  deleteNodeMutationError,
  editNodeMutationError,
  graphEdge2GqlEdge,
  graphNode2GqlNode,
} from './helpers'
import { getINodeResolver } from './INode'
import { bakeEdgeDoumentData } from './prepareData/createEdge'
import { bakeCreateNodeDoumentData } from './prepareData/createNode'
import { bakeEditNodeDoumentData } from './prepareData/editNode'

export const getGQLResolvers = (): GQLResolvers.Resolvers => {
  const INodeResolver = getINodeResolver()
  return {
    Query: {
      async node(_root, { id }, ctx /*,_info */) {
        // console.log({ id })
        const parsed = gqlNodeId2GraphNodeIdentifier(id)
        if (!parsed) {
          return null
        }
        const maybeNode = await contentGraph.node.byIdentifier(ctx.sessionEnv, parsed)
        return maybeNode ? graphNode2GqlNode(maybeNode) : null
      },

      async globalSearch(_root, { sort, text, nodeTypes, page }, ctx) {
        const searchInput: contentGraph.search.GlobalSearchInput = {
          sessionEnv: ctx.sessionEnv,
          nodeTypes: (nodeTypes ?? globalSearchNodeTypes).filter(isGlobalSearchNodeType),
          page: {
            after: page?.after,
            before: page?.before,
            first: page?.first ?? 20,
            last: page?.last ?? 20,
          },
          sort,
          text,
        }

        const { items, pageInfo } = await contentGraph.search.searchByTerm(searchInput)

        return {
          __typename: 'SearchPage',
          pageInfo: {
            __typename: 'PageInfo',
            hasNextPage: pageInfo.hasNextPage,
            hasPreviousPage: pageInfo.hasPreviousPage,
            endCursor: pageInfo.endCursor,
            startCursor: pageInfo.startCursor,
          },
          edges: items.map(([cursor, item]) => {
            const edge: GQLTypes.SearchPageEdge = {
              __typename: 'SearchPageEdge',
              cursor,
              node: graphNode2GqlNode(item),
            }
            return edge
          }),
        }
      },

      async getSession(_root, _no_args, ctx) {
        if (!ctx.sessionEnv.authId) {
          return null
        }

        const mActiveUser = await userAuth.adapters.getActiveUserByAuthAdapter({
          authId: ctx.sessionEnv.authId,
        })
        // console.log({ mActiveUser })
        if (!mActiveUser) {
          return null
        }
        const mAuthProfileNode = await contentGraph.node.byIdentifier(ctx.sessionEnv, ctx.sessionEnv.authId)
        // console.log({ mProfile })
        if (!mAuthProfileNode) {
          return null
        }

        const email = mActiveUser.email
        const authProfileNode = graphNode2GqlNode(mAuthProfileNode)
        return {
          __typename: 'UserSession',
          email,
          profile: authProfileNode,
        }
      },
    },
    Profile: INodeResolver,
    Collection: INodeResolver,
    IscedField: INodeResolver,
    IscedGrade: INodeResolver,
    Organization: INodeResolver,
    Resource: INodeResolver,
    FileFormat: INodeResolver,
    Language: INodeResolver,
    License: INodeResolver,
    ResourceType: INodeResolver,
    Mutation: {
      async recoverPassword(_root, { email } /* , ctx */) {
        await userAuth.user.recoverPasswordEmail({ email })
        return {
          __typename: 'SimpleResponse',
          success: true,
        }
      },
      async changeRecoverPassword(_root, { newPassword, token } /* , ctx */) {
        const resp = await userAuth.user.changeRecoverPassword({ newPasswordClear: newPassword, token })
        if (!resp) {
          return null
        }

        return {
          __typename: 'CreateSession',
          jwt: resp.jwt,
        }
      },
      async createSession(_root, { password, email, activationEmailToken }, { sessionEnv }) {
        const sessionResp = await userAuth.user.createSession({
          email,
          activationEmailToken,
          password,
          sessionEnv: sessionEnv,
        })
        if ('string' === typeof sessionResp) {
          return {
            __typename: 'CreateSession',
            message: sessionResp,
          }
        }
        return {
          __typename: 'CreateSession',
          ...sessionResp,
        }
      },
      async signUp(_root, { email, name, password } /* ,sessionEnv */) {
        await userAuth.newUser.signUp({ email, displayName: name, password })

        return { __typename: 'SimpleResponse', success: true }
      },
      async createNode(_root, { input }, ctx, _info) {
        if (!ctx.sessionEnv) {
          return createNodeMutationError('NotAuthorized')
        }
        const { nodeType } = input
        const nodeInput = validateCreateNodeInput(input)
        if (nodeInput instanceof Error) {
          return createNodeMutationError('UnexpectedInput', nodeInput.message)
        }
        const data = await bakeCreateNodeDoumentData(nodeInput, nodeType)
        if ('__typename' in data) {
          return data
        }
        const graphNodeOrError = await contentGraph.node.createNode({
          nodeData: {
            ...data,
          },
          sessionEnv: ctx.sessionEnv,
        })

        if (!graphNodeOrError) {
          return createNodeMutationError('AssertionFailed')
        }
        const node = graphNode2GqlNode(graphNodeOrError)
        return {
          __typename: 'CreateNodeMutationSuccess',
          node,
        }
      },
      async editNode(_root, { input }, ctx, _info) {
        const { nodeType, id } = input
        const nodeId = gqlNodeId2GraphNodeIdentifier(id)
        if (!nodeId) {
          return editNodeMutationError('UnexpectedInput', `invalid id:${id}`)
        }

        if (!ctx.sessionEnv) {
          return editNodeMutationError('NotAuthorized')
        }
        const nodeInput = validateEditNodeInput(input)
        if (nodeInput instanceof Error) {
          return editNodeMutationError('UnexpectedInput', nodeInput.message)
        }
        const data = await bakeEditNodeDoumentData(nodeInput, nodeType)
        if ('__typename' in data) {
          return data
        }
        const graphNodeOrError = await contentGraph.node.editNode({
          nodeData: {
            ...data,
          },
          nodeId,
          sessionEnv: ctx.sessionEnv,
        })
        if (!graphNodeOrError) {
          return editNodeMutationError('AssertionFailed')
        }
        const node = graphNode2GqlNode(graphNodeOrError)
        return {
          __typename: 'EditNodeMutationSuccess',
          node,
        }
      },
      async createEdge(_root, { input }, ctx, _info) {
        if (!ctx.sessionEnv) {
          return createEdgeMutationError('NotAuthorized')
        }
        const { edgeType, from, to } = input
        const fromIdentifier = gqlNodeId2GraphNodeIdentifier(from)
        const toIdentifier = gqlNodeId2GraphNodeIdentifier(to)
        if (!(fromIdentifier && toIdentifier)) {
          return createEdgeMutationError('UnexpectedInput', `can't parse node ids`)
        }

        const nodeInput = validateCreateEdgeInput(input)
        if (nodeInput instanceof Error) {
          return createEdgeMutationError('UnexpectedInput', nodeInput.message)
        }
        const data = await bakeEdgeDoumentData(nodeInput, edgeType)
        if ('__typename' in data) {
          return data
        }
        const graphEdgeOrError = await contentGraph.edge.addEdge({
          newEdge: {
            ...data,
          },
          sessionEnv: ctx.sessionEnv,
          from: fromIdentifier,
          to: toIdentifier,
        })

        if (!graphEdgeOrError) {
          return createEdgeMutationError('AssertionFailed')
        }
        const edge = graphEdge2GqlEdge(graphEdgeOrError)
        return {
          __typename: 'CreateEdgeMutationSuccess',
          edge,
        }
      },
      async deleteEdge(_root, { input }, ctx /*,  _info */) {
        const edge = gqlEdgeId2GraphEdgeIdentifier(input.id)
        if (!edge) {
          return deleteEdgeMutationError('UnexpectedInput')
        }
        if (!ctx.sessionEnv) {
          return deleteEdgeMutationError('NotAuthorized')
        }
        const deleteResult = await contentGraph.edge.deleteEdge({
          sessionEnv: ctx.sessionEnv,
          edge,
        })
        if (deleteResult === false) {
          return deleteEdgeMutationError('UnexpectedInput', null)
        }
        const successResult: GQLTypes.DeleteEdgeMutationSuccess = {
          __typename: 'DeleteEdgeMutationSuccess',
          edgeId: input.id,
        }
        return successResult
      },
      async deleteNode(_root, { input }, ctx /*,  _info */) {
        const node = gqlNodeId2GraphNodeIdentifier(input.id)
        if (!node) {
          return deleteNodeMutationError('UnexpectedInput')
        }
        if (!ctx.sessionEnv) {
          return deleteNodeMutationError('NotAuthorized')
        }
        const deleteResult = await contentGraph.node.deleteNode({
          sessionEnv: ctx.sessionEnv,
          node,
        })
        if (deleteResult === false) {
          return deleteNodeMutationError('UnexpectedInput', null)
        }
        const successResult: GQLTypes.DeleteNodeMutationSuccess = {
          __typename: 'DeleteNodeMutationSuccess',
          nodeId: input.id,
        }
        return successResult
      },
      async sendEmailToProfile(_root, { text, toProfileId }, ctx) {
        const toProfileIdentifier = gqlNodeId2GraphNodeIdentifierOfType(toProfileId, 'Profile')
        if (!(ctx.sessionEnv.authId && toProfileIdentifier)) {
          return false
        }
        const sendResult = await contentGraph.profile.sendTextToProfile({
          authId: ctx.sessionEnv.authId,
          text,
          toProfileId: toProfileIdentifier,
        })
        return sendResult
      },
    },
  }
}
