import * as GQL from '@moodlenet/common/lib/graphql/types.graphql.gen'
export type Role = GQL.Role

export type PasswordVerifier = (_: { pwdhash: string; pwd: string }) => Promise<boolean>

export type SessionEnv = {
  user: SessionEnvUser
}

export type SessionEnvUser = {
  name: string
  role: Role
}
