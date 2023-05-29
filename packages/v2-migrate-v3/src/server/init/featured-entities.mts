import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import type { KnownEntityFeature } from '@moodlenet/web-user/common'
import { Profile, type KnownFeaturedEntityItem } from '@moodlenet/web-user/server'
import assert from 'assert'
import cliProgress from 'cli-progress'
import { Collection_v2v3_IdMapping } from './collections.mjs'
import { Resource_v2v3_IdMapping } from './resources.mjs'
import { initiateCallForProfileKey } from './util.mjs'
import { v2_DB_ContentGraph } from './v2-db.mjs'
import { Profile_v2v3_IdMapping } from './web-users.mjs'

export async function featured_entities() {
  const BAR = new cliProgress.SingleBar(
    {
      format: `{bar} {percentage}% | {value}/{total} {duration_formatted}/{eta_formatted} | featured-entities for {v3ProfileId}`,
    },
    cliProgress.Presets.shades_grey,
  )

  BAR.start(Object.keys(Profile_v2v3_IdMapping).length, 0)

  for (const v2_profile_id in Profile_v2v3_IdMapping) {
    const v3ProfileId = Profile_v2v3_IdMapping[v2_profile_id]

    assert(v3ProfileId)
    BAR.update({ v3ProfileId })
    const [v2_profile_type, v2_profile_key] = v2_profile_id.split('/')
    assert(v2_profile_type && v2_profile_key)
    const knownFeaturedEntityItems = await getKnownFeaturedEntitiesFor(v2_profile_key)

    const kudosCursor = await v2_DB_ContentGraph.query<{ kudos: number }>({
      query: `
    for lk in Likes
      filter lk._fromType == "Profile"
      let res = Document(lk._to)
      let resCr = Document(CONCAT(res._creator._type, "/", res._creator._permId))
      filter @targetProfileId == resCr._id 
      collect with count into kudos 

      return {
        kudos,
      }`,
      bindVars: { targetProfileId: v2_profile_id },
    })

    const { kudos } = (await kudosCursor.next()) ?? { kudos: 0 }
    await initiateCallForProfileKey({
      _id: v3ProfileId,
      async exec() {
        await sysEntitiesDB.query({
          query: `UPDATE PARSE_IDENTIFIER(@v3ProfileId).key WITH { kudos:@kudos, knownFeaturedEntities: UNIQUE(@knownFeaturedEntityItems) } IN @@ProfileCollection`,
          bindVars: {
            v3ProfileId,
            '@ProfileCollection': Profile.collection.name,
            knownFeaturedEntityItems,
            kudos,
          },
        })
      },
    })
    BAR.increment()
  }
  BAR.stop()

  async function getKnownFeaturedEntitiesFor(
    v2_profile_key: string,
  ): Promise<KnownFeaturedEntityItem[]> {
    const allQueries = ['Likes', 'Follows', 'Bookmarked']
      .map(
        FeatColl =>
          `
        (FOR feat IN ${FeatColl} 
          FILTER feat._creator._permId == "${v2_profile_key}" && feat._creator._type == "Profile"
        RETURN feat)
        `,
      )
      .join(',')

    const query = `
    FOR feat in UNION( ${allQueries} )
      SORT feat._created
    RETURN { v2TargetId: feat._to ,v2FeatType: feat._type }
    `
    const featCursor = await v2_DB_ContentGraph.query<{
      v2TargetId: string
      v2FeatType: 'Likes' | 'Bookmarked' | 'Follows'
    }>(
      {
        query,
        bindVars: {},
      },
      { count: true, batchSize: 100 },
    )
    const featV2TargetIdTypes = await featCursor.all()

    const knownFeaturedEntities = featV2TargetIdTypes
      .map(({ v2FeatType, v2TargetId }) => {
        const [v2targetType /* , v2TargetKey */] = v2TargetId.split('/')
        const v3Feat: KnownEntityFeature =
          v2FeatType === 'Likes'
            ? 'like'
            : v2FeatType === 'Bookmarked'
            ? 'bookmark'
            : v2FeatType === 'Follows'
            ? 'follow'
            : (null as never)
        const toV3Id =
          v2targetType === 'Resource'
            ? Resource_v2v3_IdMapping[v2TargetId]
            : v2targetType === 'Collection'
            ? Collection_v2v3_IdMapping[v2TargetId]
            : v2targetType === 'Profile'
            ? Profile_v2v3_IdMapping[v2TargetId]
            : undefined

        if (!toV3Id) {
          // REMOVE ME !!!
          // REMOVE ME !!!
          // REMOVE ME !!!
          // REMOVE ME !!!
          // REMOVE ME !!!
          // REMOVE ME !!!
          return null as any
        }
        assert(
          toV3Id && v3Feat,
          `something missing from v2FeatType:${v2FeatType} v2TargetId:${v2TargetId} -- v3Feat:${v3Feat} toV3Id:${toV3Id}`,
        )

        const newItem: KnownFeaturedEntityItem = { _id: toV3Id, feature: v3Feat }
        return newItem
      })
      .filter(Boolean)
    return knownFeaturedEntities
  }
}
