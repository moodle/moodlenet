import { MoodleNetAuthenticatedExecutionContext, MoodleNetExecutionContext } from './types'

export function getSessionContext(
  context: MoodleNetAuthenticatedExecutionContext,
): MoodleNetExecutionContext<'session'> {
  if (context.type === 'session') {
    return context
  }
  return context.as
}
