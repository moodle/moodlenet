import { getEntityIdentifiersById } from '@moodlenet/system-entities/common'
import { Profile, on } from '@moodlenet/web-user/server'
import { profileCreatedResource, welcomeNewWebUser } from '../ctrl/handlers.mjs'
import { env } from '../env.mjs'
if (!env.noBgProc) {
  on('created-web-user-account', ({ data: { profileKey } }) => {
    welcomeNewWebUser({ profileKey })
  })
  on('resource-created', ({ data: { resource } }) => {
    const creatorEntityId = resource._meta.creatorEntityId
    if (!creatorEntityId) {
      return
    }
    const profileIds = getEntityIdentifiersById({
      _id: creatorEntityId,
      ensureClass: Profile.entityClass,
    })
    if (!profileIds) {
      return
    }
    const profileKey = profileIds.entityIdentifier._key
    profileCreatedResource({ profileKey })
  })
}
