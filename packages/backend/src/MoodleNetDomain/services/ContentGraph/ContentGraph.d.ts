import { WrkDef } from '../../../lib/domain/wrk'
import { GraphQLApi, MoodleNetExecutionContext } from '../../MoodleNetGraphQL'
import { Id } from '../UserAccount/types'
import * as GQL from './ContentGraph.graphql.gen'
import { ShallowNode } from './types.node'

export type ContentGraph = {
  GQL: GraphQLApi
  Node: {
    ById: WrkDef<
      <N extends GQL.Node = GQL.Node>({
        // ctx,
        _id,
      }: {
        _id: Id
        ctx: MoodleNetExecutionContext
      }) => Promise<ShallowNode<N> | null>
    >
  }
}
