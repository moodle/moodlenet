import { AqlVal } from '@moodlenet/system-entities/server'
import { creatorEntityDoc, toaql } from '@moodlenet/system-entities/server/aql-ac'
import { WebUserProfile } from './init.mjs'
import { WebUserProfileEntity } from './types.mjs'

export function webUserCreatorEntity(): AqlVal<WebUserProfileEntity> {
  return `((FOR c in [${creatorEntityDoc()}] filter c._meta.entityClass == ${toaql(
    WebUserProfile.entityClass,
  )} return c)[0])`
}
