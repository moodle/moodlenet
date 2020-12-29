import { ContentGraph } from './services/ContentGraph/Content-Graph'
import { Email } from './services/Email/Email'
import { UserAccount } from './services/UserAccount/UserAccount'

export type MoodleNetDomain = {
  UserAccount: UserAccount
  Email: Email
  ContentGraph: ContentGraph
}
