import type { AqlVal } from '@moodlenet/system-entities/server'
import { creatorEntityDoc, toaql } from '@moodlenet/system-entities/server'
import { WebUserProfile } from './init.mjs'
import type { WebUserProfileEntity } from './types.mjs'

export function webUserCreatorEntity(): AqlVal<WebUserProfileEntity> {
  return `((FOR c in [${creatorEntityDoc()}] filter c._meta.entityClass == ${toaql(
    WebUserProfile.entityClass,
  )} return c)[0])`
}
