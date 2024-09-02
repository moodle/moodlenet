import { IscedField } from '@moodlenet/ed-meta/server'
import type { KnownEntityFeature, KnownEntityType } from '@moodlenet/web-user/common'
import { entityFeatureAction } from '@moodlenet/web-user/server'
import assert from 'assert'
import cliProgress from 'cli-progress'
import { shell } from '../shell.mjs'
import { Collection_v2v3_IdMapping } from './collections.mjs'
import { Resource_v2v3_IdMapping } from './resources.mjs'
import { initiateCallForV3ProfileId } from './util.mjs'
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
    const [, v3ProfileKey] = v3ProfileId.split('/')
    assert(v3ProfileKey)
    BAR.update({ v3ProfileId })
    await initiateCallForV3ProfileId({
      _id: v3ProfileId,
      async exec() {
        const [v2_profile_type, v2_profile_key] = v2_profile_id.split('/')
        assert(v2_profile_type && v2_profile_key)

        const allQueries = ['Likes', 'Follows', 'Bookmarked']
          .map(
            V2FeatColl =>
              `
        (FOR feat IN ${V2FeatColl}
          FILTER feat._from == "${v2_profile_id}"
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
          { count: true },
        )
        const featV2TargetIdTypes = await featCursor.all()

        for (const { v2FeatType, v2TargetId } of featV2TargetIdTypes) {
          const [v2targetEntitiyType, v2TargetEntitiyKey] = v2TargetId.split('/')
          const v3KnownEntityFeature: KnownEntityFeature =
            v2FeatType === 'Likes'
              ? 'like'
              : v2FeatType === 'Bookmarked'
                ? 'bookmark'
                : v2FeatType === 'Follows'
                  ? 'follow'
                  : (null as never)
          const v3Target: {
            knownEntityType: KnownEntityType
            toV3EntityId: string | undefined
          } | null =
            v2targetEntitiyType === 'Resource'
              ? { toV3EntityId: Resource_v2v3_IdMapping[v2TargetId], knownEntityType: 'resource' }
              : v2targetEntitiyType === 'Collection'
                ? {
                    toV3EntityId: Collection_v2v3_IdMapping[v2TargetId],
                    knownEntityType: 'collection',
                  }
                : v2targetEntitiyType === 'Profile' || v2targetEntitiyType === 'Organization'
                  ? { toV3EntityId: Profile_v2v3_IdMapping[v2TargetId], knownEntityType: 'profile' }
                  : v2targetEntitiyType === 'IscedField'
                    ? {
                        toV3EntityId: `${IscedField.collection.name}/${v2TargetEntitiyKey}`,
                        knownEntityType: 'subject',
                      }
                    : null

          if (!(v3KnownEntityFeature && v3Target?.toV3EntityId)) {
            shell.log(
              'warn',
              `
something missing from v2FeatType:${v2FeatType} v2TargetId:${v2TargetId}:
v3KnownEntityFeature:${v3KnownEntityFeature}
v3Target.knownEntityType:${v3Target?.knownEntityType}
v3Target.toV3EntityId:${v3Target?.toV3EntityId}
... skip this one
`,
            )
            continue
          }
          const { toV3EntityId, knownEntityType } = v3Target
          const [, toV3EntityKey] = toV3EntityId.split('/')
          assert(toV3EntityKey)
          await entityFeatureAction({
            profileKey: v3ProfileKey,
            action: 'add',
            _key: toV3EntityKey,
            entityType: knownEntityType,
            feature: v3KnownEntityFeature,
          })
        }
      },
    })
    BAR.increment()
  }
  BAR.stop()
}
