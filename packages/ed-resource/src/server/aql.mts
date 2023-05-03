import { AqlVal, isCurrentUserCreatorOfCurrentEntity } from '@moodlenet/system-entities/server'

export function canPublish(): AqlVal<boolean> {
  return `${isCurrentUserCreatorOfCurrentEntity()}`
}
