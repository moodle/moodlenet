import { IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { WrkDef } from '../../../lib/domain/wrk'
import { GraphQLApi } from '../../MoodleNetGraphQL'
import { Id } from '../UserAccount/types'
import { Profile } from './ContentGraph.graphql.gen'
import { ShallowNode } from './types.node'

export type ContentGraph = {
  GQL: GraphQLApi
  CreateProfileForNewUser: WrkDef<(_: { username: string; key: IdKey }) => Promise<ShallowNode<Profile>>>
  GetUserProfile: WrkDef<(_: { profileId: Id }) => Promise<ShallowNode<Profile> | null>>
}
