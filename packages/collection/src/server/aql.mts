import type { AqlVal } from '@moodlenet/system-entities/server'
import { isCurrentUserCreatorOfCurrentEntity } from '@moodlenet/system-entities/server'

export function canPublish(): AqlVal<boolean> {
  return `${isCurrentUserCreatorOfCurrentEntity()}`
}
