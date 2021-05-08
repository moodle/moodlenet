import { isId, parseNodeId } from '@moodlenet/common/lib/utils/content-graph'
import { GraphQLScalarType } from 'graphql'
import { resolve } from '../../lib/qmino/root'
import { byId } from '../../ports/queries/content-graph/get-content-node'
import * as GQL from '../types.graphql.gen'
import { fakeNodeByShallowOrDoc } from './helpers'

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
// const AssetRef = new GraphQLScalarType({
//   name: 'AssetRef',
//   serialize: JSON.stringify,
//   parseValue: v => {
//     console.log('--', v)
//     return v
//   },
// })
export const getGQLResolvers = (): GQL.Resolvers => {
  return {
    Query: {
      async node(_root, { id }, ctx /* ,_info */) {
        const { nodeType, _key } = parseNodeId(id)
        const maybeNode = await resolve(byId({ _key, ctx, nodeType }))()
        return maybeNode && fakeNodeByShallowOrDoc(maybeNode)
      },
    },

    //@ts-expect-error
    ID,
  }
}
