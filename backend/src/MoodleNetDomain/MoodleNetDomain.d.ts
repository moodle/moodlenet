import { MoodleNetExecutionAuth } from './services/graphql-gateway/JWT'
import { Accounting } from './services/accounting/Accounting'
import { ContentGraph } from './services/content-graph/Content-Graph'
import { Email } from './services/email/Email'

export type MoodleNetDomain = {
  Accounting: Accounting
  Email: Email
  ContentGraph: ContentGraph
}
