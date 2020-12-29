import { MoodleNetExecutionAuth } from './services/GraphqQLGateway/JWT'
import { UserAccount } from './services/UserAccount/UserAccount'
import { ContentGraph } from './services/ContentGraph/Content-Graph'
import { Email } from './services/Email/Email'
import { MoodleNet } from '.'
import { GraphQLDomainApi } from '../lib/domain/api/types'

export type MoodleNetDomain = {
  UserAccount: UserAccount
  Email: Email
  ContentGraph: ContentGraph
}

export type MoodleNetGraphQLContext = {
  auth: MoodleNetExecutionAuth | null
}

export type MoodleNetGraphQLRootValue = {}

type MoodleNetGraphQLApi = GraphQLDomainApi<
  MoodleNetGraphQLContext,
  MoodleNetGraphQLRootValue
>
