import {
  CollectionEntitiesTools,
  deltaCollectionPopularityItem,
} from '@moodlenet/collection/server'
import { deltaIscedFieldPopularityItem, EdMetaEntitiesTools } from '@moodlenet/ed-meta/server'
import { deltaResourcePopularityItem, EdResourceEntitiesTools } from '@moodlenet/ed-resource/server'
import { getEntityIdentifiersById } from '@moodlenet/system-entities/common'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { WebUserEntitiesTools } from '../../../entities.mjs'
import { deltaProfilePopularityItem } from '../../../lib/profile.mjs'
import type { KnownFeaturedEntityItem } from '../../../types.mjs'
import { Profile } from '../../sys-entities.mjs'

const featsCursor = await sysEntitiesDB.query<{ item: KnownFeaturedEntityItem; count: number }>({
  query: `
  FOR featItem IN FLATTEN(
    FOR p IN @@collection
    FILTER LENGTH(p.knownFeaturedEntities) > 0
    RETURN p.knownFeaturedEntities
  )
  FILTER featItem.feature != 'bookmark'
  COLLECT item = featItem
  WITH COUNT INTO count
  RETURN {
    item,
    count
  }
`,
  bindVars: { '@collection': Profile.collection.name },
})

const feats = await featsCursor.all()
await Promise.all(
  feats.map(async ({ item: { _id, feature }, count }) => {
    const itemName = feature === 'follow' ? 'followers' : feature === 'like' ? 'likes' : null
    const _key = getEntityIdentifiersById({ _id })?.entityIdentifier._key
    if (!(itemName && _key)) {
      return
    }

    return (
      WebUserEntitiesTools.getIdentifiersById({ _id, type: 'Profile' })
        ? deltaProfilePopularityItem
        : EdMetaEntitiesTools.getIdentifiersById({ _id, type: 'IscedField' })
        ? deltaIscedFieldPopularityItem
        : EdResourceEntitiesTools.getIdentifiersById({ _id, type: 'Resource' })
        ? deltaResourcePopularityItem
        : CollectionEntitiesTools.getIdentifiersById({ _id, type: 'Collection' })
        ? deltaCollectionPopularityItem
        : () => void 0
    )({
      _key,
      delta: count,
      itemName,
    })
  }),
)

export default -96
