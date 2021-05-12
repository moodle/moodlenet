import { Id } from '../utils/content-graph/id-key-type-guards'

export type CtxTypes = keyof MoodleNetExecutionContextMap
export type MoodleNetExecutionContextMap = {
  session: {
    userId: string
    username: string
    email: string
    role: Role
    profileId: Id
  }
  system: {
    as: MoodleNetExecutionContext<'session'>
  }
  anon: {}
}
export type MoodleNetAuthenticatedExecutionContext = MoodleNetExecutionContext<'session' | 'system'>

type TypeUnion<T> = keyof T extends infer P
  ? P extends keyof T // Introduce an extra type parameter P to distribute over
    ? T extends object
      ? { type: P } & T[P] // Take each P and create the union member
      : never
    : never
  : never

export type MoodleNetExecutionContext<T extends CtxTypes = CtxTypes> = TypeUnion<Pick<MoodleNetExecutionContextMap, T>>
export type Role = 'User' | 'Admin' | 'System'
