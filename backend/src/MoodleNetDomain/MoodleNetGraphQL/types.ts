import { GraphQLDomainApi } from '../../lib/domain/api/types'
import { Role } from '../services/ContentGraph/ContentGraph.graphql.gen'
import { SessionAccount } from '../services/UserAccount/UserAccount.graphql.gen'

export type MoodleNetExecutionAuth = {
  // TODO: May prefer to define an independent type for this, mapped from UserAccount#SessionAccount, instead of direct usage
  sessionAccount: SessionAccount
  userRole: Role
  userId: string
}
export type Context = {
  auth: MoodleNetExecutionAuth | null
}

export type RootValue = {}

export type GraphQLApi = GraphQLDomainApi<Context, RootValue>

export type GQLServiceName = 'ContentGraph' | 'UserAccount'
