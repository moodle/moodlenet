import { MoodleNetExecutionContext } from '@moodlenet/common/lib/executionContext/types'
import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'

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
