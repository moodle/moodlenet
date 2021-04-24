import { cantBindMessage } from '@moodlenet/common/lib/content-graph/strings'
import { isId, parseNodeId } from '@moodlenet/common/lib/utils/content-graph'
import { GraphQLScalarType } from 'graphql'
import { call } from '../../../../../../lib/domain/amqp/call'
import * as GQL from '../../../ContentGraph.graphql.gen'
import { validateCreateEdgeInput } from '../../../graphql/inputStaticValidation/createEdge'
import { validateCreateNodeInput } from '../../../graphql/inputStaticValidation/createNode'
import { MoodleNetArangoContentGraphSubDomain } from '../MoodleNetArangoContentGraphSubDomain'
import {
  createEdgeMutationError,
  createNodeMutationError,
  deleteEdgeMutationError,
  fakeUnshallowEdgeForResolverReturnType,
  fakeUnshallowNodeForResolverReturnType,
} from './helpers'
import { nodePropResolver } from './nodePropResolver'
import { EdgeResolver } from './types.edge'
import { NodeResolver } from './types.node'

const checkIDOrError = (_?: string) => {
  if (!isId(_)) {
    throw 'invalid ID'
  }
  return _
}
const ID = new GraphQLScalarType({
  name: 'ID',
  serialize: String,
  parseValue: v => checkIDOrError(v),
  parseLiteral: vnode => (vnode.kind === 'StringValue' ? checkIDOrError(vnode.value) : null),
})
export const getContentGraphResolvers = (): GQL.Resolvers => {
  return {
    Mutation: {
      deleteNode: (() => {}) as any, //TODO: define resolver

      updateEdge: (() => {}) as any, //TODO: define resolver

      updateNode: (() => {}) as any, //TODO: define resolver

      async createEdge(_root, { input }, ctx /*,  _info */) {
        // console.log('createEdge', input)
        const { edgeType, from, to } = input
        if (ctx.type === 'anon') {
          return createEdgeMutationError('NotAuthorized', `Anonymous can't create`)
        }
        const edgeInput = validateCreateEdgeInput(input)
        if (edgeInput instanceof Error) {
          return createEdgeMutationError('UnexpectedInput', edgeInput.message)
        }
        const shallowEdgeOrError = await call<MoodleNetArangoContentGraphSubDomain>()(
          'ContentGraph.Edge.Create',
          ctx.flow,
        )({
          ctx,
          data: edgeInput,
          edgeType,
          from,
          to,
        })

        if (typeof shallowEdgeOrError === 'string') {
          return createEdgeMutationError(shallowEdgeOrError, cantBindMessage({ edgeType, from, to }))
        }
        const successResult: GQL.CreateEdgeMutationSuccess = {
          __typename: 'CreateEdgeMutationSuccess',
          edge: fakeUnshallowEdgeForResolverReturnType(shallowEdgeOrError),
        }

        return successResult
      },

      async createNode(_root, { input }, ctx, _info) {
        const { nodeType } = input
        if (ctx.type === 'anon') {
          return createNodeMutationError('NotAuthorized')
        }

        const nodeInput = validateCreateNodeInput(input)
        if (nodeInput instanceof Error) {
          return createNodeMutationError('UnexpectedInput', nodeInput.message)
        }

        const shallowNodeOrError = await call<MoodleNetArangoContentGraphSubDomain>()(
          'ContentGraph.Node.Create',
          ctx.flow,
        )({
          ctx,
          data: nodeInput,
          nodeType,
        })

        if (typeof shallowNodeOrError === 'string') {
          return createNodeMutationError(shallowNodeOrError, '')
        }
        const successResult: GQL.CreateNodeMutationSuccess = {
          __typename: 'CreateNodeMutationSuccess',
          node: fakeUnshallowNodeForResolverReturnType(shallowNodeOrError),
        }

        return successResult
      },

      async deleteEdge(_root, { input }, ctx /*,  _info */) {
        // console.log('deleteEdge', input)
        const { edgeType, id } = input
        if (ctx.type === 'anon') {
          return deleteEdgeMutationError('NotAuthorized', `Anonymous can't delete`)
        }

        const deleteResult = await call<MoodleNetArangoContentGraphSubDomain>()('ContentGraph.Edge.Delete', ctx.flow)({
          ctx,
          edgeType,
          edgeId: id,
        })

        if (typeof deleteResult === 'string') {
          return deleteEdgeMutationError(deleteResult, null)
        }
        const successResult: GQL.DeleteEdgeMutationSuccess = {
          __typename: 'DeleteEdgeMutationSuccess',
          edgeId: id,
        }

        return successResult
      },
    },

    Query: {
      async node(_root, { id }, ctx /* ,_info */) {
        const { nodeType, _key } = parseNodeId(id)
        const maybeNode = await call<MoodleNetArangoContentGraphSubDomain>()('ContentGraph.Node.ById', ctx.flow)({
          _key,
          nodeType,
          ctx,
        })
        return maybeNode && fakeUnshallowNodeForResolverReturnType(maybeNode)
      },

      async getUserSessionProfile(_root, { profileId }, ctx /*_info */) {
        if (!profileId) {
          return {
            __typename: 'UserSession',
            profile: null,
          }
        }
        const { _key, nodeType } = parseNodeId(profileId)
        if (nodeType !== 'Profile') {
          return null
        }
        const shallowProfile = await call<MoodleNetArangoContentGraphSubDomain>()('ContentGraph.Node.ById', ctx.flow)({
          _key,
          nodeType,
          ctx,
        })
        if (!shallowProfile) {
          throw new Error('Profile not found')
        }

        return {
          __typename: 'UserSession',
          profile: fakeUnshallowNodeForResolverReturnType<GQL.Profile>(shallowProfile),
        }
      },

      async globalSearch(_root, { text, page, nodeTypes, sortBy }, ctx /* ,_info */) {
        const searchPage = await call<MoodleNetArangoContentGraphSubDomain>()('ContentGraph.GlobalSearch', ctx.flow)({
          page,
          text,
          nodeTypes,
          sortBy,
        })
        return searchPage
      },
    },

    //Nodes
    Profile: NodeResolver,
    Subject: NodeResolver,
    Resource: NodeResolver,
    Collection: NodeResolver,

    //Edges
    AppliesTo: EdgeResolver,
    Contains: EdgeResolver,
    Created: EdgeResolver,
    Follows: EdgeResolver,
    Likes: EdgeResolver,

    // Empty: {} as any, //TODO: define resolver
    // DateTime: {} as any, //TODO: define resolver
    // Never: null as never, //TODO: define resolver
    // Cursor: {} as any, //TODO: define resolver

    GlyphByAt: {
      by: nodePropResolver<GQL.GlyphByAt>('by') as any,
    },

    //@ts-expect-error
    ID,

    // Edge: {
    //   __resolveType: obj => {
    //     console.log({ Edge: obj })

    //     return edgeTypeFromId(obj._id) || null
    //   },
    // },
    // Node: {
    //   __resolveType: obj => {
    //     console.log({ Node: obj })

    //     return nodeTypeFromId(obj._id) || null
    //   },
    // },
    // INode: {
    //   __resolveType: obj => {
    //     console.log({ INode: obj })

    //     return nodeTypeFromId(obj._id) || null
    //   },
    // },
    // IEdge: {
    //   __resolveType: obj => {
    //     console.log({ IEdge: obj })

    //     return edgeTypeFromId(obj._id) || null
    //   },
    // },
  }
}
