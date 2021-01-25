import { GraphQLDomainApi } from '../../lib/domain/api/types'
import { Role } from '../services/ContentGraph/ContentGraph.graphql.gen'

export type MoodleNetExecutionAuth = {
  // TODO: May prefer to define an independent type for this, mapped from UserAccount#SessionAccount, instead of direct usage
  accountId: string
  username: string
  email: string
  displayName: string
  role: Role
  userId: string
}
export type Context = {
  auth: MoodleNetExecutionAuth | null
}

export type RootValue = {}

export type GraphQLApi = GraphQLDomainApi<Context, RootValue>

export type GQLServiceName = 'ContentGraph' | 'UserAccount'
