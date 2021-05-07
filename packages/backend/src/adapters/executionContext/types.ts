import { Id } from '@moodlenet/common/lib/utils/content-graph'

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

export const getSystemExecutionContext = ({
  as = getSystemSession({}),
}: {
  as?: MoodleNetExecutionContext<'session'>
}): MoodleNetExecutionContext<'system'> => ({
  type: 'system',
  as,
})

//FIXME ASAP
export const SystemUsername = 'SYSTEM' as Id
export const SystemProfileId = `Profile/${SystemUsername}` as Id
export const SystemUserId = `User/${SystemUsername}` as Id
export const getSystemSession = (_?: {}): MoodleNetExecutionContext<'session'> => ({
  email: 'system_email@system_email.system_email',
  profileId: SystemProfileId,
  role: 'System',
  type: 'session',
  userId: SystemUserId,
  username: SystemUsername,
})
//FIXME ASAP

export const getSessionExecutionContext = (ctx: MoodleNetExecutionContext) =>
  ctx.type === 'system' ? ctx.as : ctx.type === 'anon' ? undefined : ctx

// export const isSystemExecutionContext = (ctx: MoodleNetExecutionContext) => ctx.system

export type Role = 'User' | 'Admin' | 'System'
