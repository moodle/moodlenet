import { MoodleNetExecutionAuth } from './services/GraphqlGateway/JWT'
import { UserAccount } from './services/UserAccount/UserAccount'
import { ContentGraph } from './services/ContentGraph/Content-Graph'
import { Email } from './services/Email/Email'

export type MoodleNetDomain = {
  UserAccount: UserAccount
  Email: Email
  ContentGraph: ContentGraph
}
