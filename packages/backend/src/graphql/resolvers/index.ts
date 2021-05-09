import { IDScalarType } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { parseNodeId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { resolve } from '../../lib/qmino'
import { byId } from '../../ports/queries/content-graph/get-content-node'
import { search } from '../../ports/queries/content-graph/global-search'
import * as GQL from '../types.graphql.gen'
import { fakeNodeByShallowOrDoc } from './helpers'

export const getGQLResolvers = (): GQL.Resolvers => {
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
    },
  }
}
