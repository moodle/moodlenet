import type { AqlVal } from '@moodlenet/system-entities/server'
import { creatorEntityDoc, toaql } from '@moodlenet/system-entities/server'
import { Profile } from './init/sys-entities.mjs'
import type { ProfileEntity } from './types.mjs'

export function webUserCreatorEntity(): AqlVal<ProfileEntity> {
  return `((FOR c in [${creatorEntityDoc()}] filter c._meta.entityClass == ${toaql(
    Profile.entityClass,
  )} return c)[0])`
}
