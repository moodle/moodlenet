import { AqlVal, isCreator } from '@moodlenet/system-entities/server'

export function canPublish(): AqlVal<boolean> {
  return `${isCreator()}`
}
