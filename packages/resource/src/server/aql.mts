import { AqlVal } from '@moodlenet/system-entities/server'
import { isCreator } from '@moodlenet/system-entities/server/aql-ac'

export function canPublish(): AqlVal<boolean> {
  return `${isCreator()}`
}
