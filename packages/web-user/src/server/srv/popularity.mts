import { deltaCollectionPopularityItem } from '@moodlenet/collection/server'
import { deltaIscedFieldPopularityItem } from '@moodlenet/ed-meta/server'
import { deltaResourcePopularityItem } from '@moodlenet/ed-resource/server'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import type { KnownEntityFeature, KnownEntityType } from '../../common/types.mjs'
import { Profile } from '../init/sys-entities.mjs'
import type { ProfileDataType } from '../types.mjs'

export async function deltaPopularity(
  delta: number,
  {
    entityKey,
    entityType,
    feature,
  }: {
    feature: KnownEntityFeature
    entityType: KnownEntityType
    entityKey: string
  },
) {
  if (feature === 'like') {
    if (entityType === 'resource') {
      await deltaResourcePopularityItem({ _key: entityKey, itemName: 'likes', delta })
    }
  } else if (feature === 'follow') {
    if (entityType === 'collection') {
      await deltaCollectionPopularityItem({ _key: entityKey, itemName: 'followers', delta })
    } else if (entityType === 'profile') {
      await deltaProfilePopularityItem({ _key: entityKey, itemName: 'followers', delta })
    } else if (entityType === 'subject') {
      await deltaIscedFieldPopularityItem({ _key: entityKey, itemName: 'followers', delta })
    }
  }
}
export async function deltaProfilePopularityItem({
  _key,
  itemName,
  delta,
}: {
  _key: string
  itemName: string
  delta: number
}) {
  const updatePopularityResult = await sysEntitiesDB.query<ProfileDataType>(
    {
      query: `FOR res in @@profileCollection 
      FILTER res._key == @_key
      LIMIT 1
        UPDATE res WITH {
          popularity:{
            overall: res.popularity.overall + ( ${delta} ),
            items:{
              "${itemName}": (res.popularity.items["${itemName}"] || 0) + ( ${delta} )
            }
          }
        } IN @@profileCollection 
      RETURN NEW`,
      bindVars: { '@profileCollection': Profile.collection.name, _key },
    },
    {
      retryOnConflict: 5,
    },
  )
  const updated = await updatePopularityResult.next()
  return updated?.popularity?.overall
}
