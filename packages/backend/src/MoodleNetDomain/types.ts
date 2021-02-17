import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { newFlow } from '../lib/domain/helpers'
import { Flow } from '../lib/domain/types/path'

export type MoodleNetExecutionAuth = {
  accountId: string
  username: string
  email: string
  role: Role
  userId: Id
}

export type MoodleNetExecutionContext = {
  auth: MoodleNetExecutionAuth | null
  system: boolean
  flow: Flow
}

export const getSystemExecutionContextFor = (ctx?: MoodleNetExecutionContext): MoodleNetExecutionContext => {
  return {
    ...(ctx || { auth: null, flow: newFlow() }),
    system: true,
  }
}

export const isSystemExecutionContext = (ctx: MoodleNetExecutionContext) => ctx.system

export enum Role {
  User = 'User',
  Admin = 'Admin',
}
