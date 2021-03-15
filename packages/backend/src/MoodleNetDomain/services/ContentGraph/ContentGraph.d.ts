import { IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { WrkDef } from '../../../lib/domain/wrk'
import { GraphQLApi } from '../../MoodleNetGraphQL'
import { Id } from '../UserAccount/types'
import { User } from './ContentGraph.graphql.gen'
import { ShallowNode } from './types.node'

export type ContentGraph = {
  GQL: GraphQLApi
  CreateNewRegisteredUser: WrkDef<(_: { username: string; key: IdKey }) => Promise<ShallowNode<User>>>
  GetAccountUser: WrkDef<(_: { userId: Id }) => Promise<ShallowNode<User> | null>>
}
