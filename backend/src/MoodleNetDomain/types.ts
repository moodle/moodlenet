import { Flow } from '../lib/domain/types/path'
import { Role } from './services/ContentGraph/ContentGraph.graphql.gen'

export type MoodleNetExecutionAuth = {
  accountId: string
  username: string
  email: string
  displayName: string
  role: Role
  userId: string
}

export type MoodleNetExecutionContext = {
  auth: MoodleNetExecutionAuth | null
  flow: Flow
}
