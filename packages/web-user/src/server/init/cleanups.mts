import * as collection from '@moodlenet/collection/server'
import * as resource from '@moodlenet/ed-resource/server'
import type { SomeEntityDataType } from '@moodlenet/system-entities/common'
import type { EntityFullDocument } from '@moodlenet/system-entities/server'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import type { KnownEntityType } from '../../common/types.mjs'
import { Profile, WebUserEntitiesTools } from '../exports.mjs'
import { shell } from '../shell.mjs'
import { deltaPopularity } from '../srv/popularity.mjs'

... deve essere il consumer deella coda di activitylog da db ... shell.events.on('resource-deleted', ({ data: { resourceKey } }) => {
  const { _id: featuredEntityId } = resource.EdResourceEntitiesTools.getIdentifiersByKey({
    _key: resourceKey,
    type: 'Resource',
  })
  removeFeaturedFromAllUsers({ featuredEntityId })
  removeResourceFromAllCollections({ resourceKey })
})
... deve essere il consumer deella coda di activitylog da db ... shell.events.on('collection-deleted', ({ data: { collectionKey } }) => {
  const { _id: featuredEntityId } = collection.CollectionEntitiesTools.getIdentifiersByKey({
    _key: collectionKey,
    type: 'Collection',
  })
  removeFeaturedFromAllUsers({ featuredEntityId })
})
... deve essere il consumer deella coda di activitylog da db ... shell.events.on('user-publishing-permission-change', async ({ data: { profileKey, type } }) => {
  ... profile  deve sta nell'evento ... const profile = await Profile.collection.document({ _key: profileKey }, { graceful: true })
  if (!profile) {
    return
  }
  await Promise.all(
    profile.knownFeaturedEntities.map(async ({ _id: targetEntityId, feature }) => {
      const targetEntityDoc = await (
        await sysEntitiesDB.query<EntityFullDocument<SomeEntityDataType>>({
          query: 'RETURN DOCUMENT(@targetEntityId)',
          bindVars: { targetEntityId },
        })
      ).next()
      if (!targetEntityDoc) {
        return
      }
      const profileCreatorIdentifiers = targetEntityDoc._meta.creatorEntityId
        ? WebUserEntitiesTools.getIdentifiersById({
            _id: targetEntityDoc._meta.creatorEntityId,
            type: 'Profile',
          })
        : undefined

      const add = type === 'given'
      return deltaPopularity(add, {
        feature,
        profileCreatorIdentifiers,
        entityType: targetEntityDoc._meta.entityClass.type as KnownEntityType,
        entityKey: targetEntityDoc._key,
      })
    }),
  )
})

async function removeFeaturedFromAllUsers({ featuredEntityId }: { featuredEntityId: string }) {
  sysEntitiesDB.query(
    `
FOR profile IN \`${Profile.collection.name}\`
  FILTER @featuredEntityId IN profile.knownFeaturedEntities[*]._id
  LET filteredFeats = profile.knownFeaturedEntities[* FILTER CURRENT._id != @featuredEntityId] 
  UPDATE profile WITH { knownFeaturedEntities: filteredFeats } IN \`${Profile.collection.name}\`
`,
    { featuredEntityId },
  )
}
async function removeResourceFromAllCollections({ resourceKey }: { resourceKey: string }) {
  return sysEntitiesDB.query(
    `
FOR collection IN \`${collection.Collection.collection.name}\`
  FILTER @resourceKey IN collection.resourceList[*]._key
  LET filteredResourceList = collection.resourceList[* FILTER CURRENT._key != @resourceKey] 
  UPDATE collection WITH { resourceList: filteredResourceList } IN \`${collection.Collection.collection.name}\`
`,
    { resourceKey },
    { retryOnConflict: 5 },
  )
}
