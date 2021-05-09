import {
  MoodleNetAuthenticatedExecutionContext,
  MoodleNetExecutionContext,
} from '@moodlenet/common/lib/executionContext/types'

export function getSessionContext(
  context: MoodleNetAuthenticatedExecutionContext,
): MoodleNetExecutionContext<'session'> {
  if (context.type === 'session') {
    return context
  }
  return context.as
}
