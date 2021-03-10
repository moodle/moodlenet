import { ContentGraph } from './services/ContentGraph/ContentGraph'
import { Email } from './services/Email/Email'
import { UserAccount } from './services/UserAccount/UserAccountDomain'

export type MoodleNetDomain = {
  UserAccount: UserAccount
  Email: Email
  ContentGraph: ContentGraph
}
