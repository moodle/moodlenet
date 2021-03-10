import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { Flow, newFlow, PFlow } from '../lib/domain/flow'

export type CtxTypes = keyof MoodleNetExecutionContextMap
export type MoodleNetExecutionContextMap = {
  session: {
    accountId: string
    username: string
    email: string
    role: Role
    userId: Id
  }
  system: {
    as?: MoodleNetExecutionContext<'session'>
  }
  anon: {}
}

type TypeUnion<T> = keyof T extends infer P
  ? P extends keyof T // Introduce an extra type parameter P to distribute over
    ? T extends object
      ? { type: P } & T[P] // Take each P and create the union member
      : never
    : never
  : never

export type MoodleNetExecutionContext<T extends CtxTypes = CtxTypes> = TypeUnion<
  Pick<MoodleNetExecutionContextMap, T>
> & {
  flow: Flow
}

export const getSystemExecutionContext = (
  _: { as?: MoodleNetExecutionContext<'session'>; flow?: PFlow } = {},
): MoodleNetExecutionContext<'system'> => ({
  type: 'system',
  as: _.as,
  flow: newFlow(_.flow),
})

export const getSessionExecutionContext = (ctx: MoodleNetExecutionContext) =>
  ctx.type === 'system' ? ctx.as : ctx.type === 'anon' ? undefined : ctx

// export const isSystemExecutionContext = (ctx: MoodleNetExecutionContext) => ctx.system

export enum Role {
  User = 'User',
  Admin = 'Admin',
}
