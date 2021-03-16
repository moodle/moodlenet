import { ContentGraph } from './services/ContentGraph/ContentGraph'
import { Email } from './services/Email/EmailDomain'
import { UserAuth } from './services/UserAuth/UserAuthDomain'

export type MoodleNetDomain = {
  UserAuth: UserAuth
  Email: Email
  ContentGraph: ContentGraph
}
