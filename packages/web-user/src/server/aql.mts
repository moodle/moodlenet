import type { AqlVal } from '@moodlenet/system-entities/server'
import { creatorEntityDocVar, toaql } from '@moodlenet/system-entities/server'
import { Profile } from './init/sys-entities.mjs'
import type { ProfileEntity } from './types.mjs'

export function _______webUserCreatorEntity(): AqlVal<ProfileEntity> {
  return `((FOR c in [DOCUMENT(${creatorEntityDocVar})] filter c._meta.entityClass == ${toaql(
    Profile.entityClass,
  )} return c)[0])`
}
