import type { ResourceDataType } from '@moodlenet/ed-resource/server'
import { createResource } from '@moodlenet/ed-resource/server'
import assert from 'assert'
import cliProgress from 'cli-progress'
import type * as v2 from '../v2-types/v2.mjs'
import { initiateCallForProfileKey } from './initiate-call-for-profile.mjs'
import { v2_DB_ContentGraph } from './v2-db.mjs'
import { Profile_v2v3_IdMapping } from './web-users.mjs'
export const Resource_v2v3_IdMapping: Record<string, string> = {}
export const Resource_v3v2_IdMapping: Record<string, string> = {}

export async function user_resources() {
  const BAR = new cliProgress.SingleBar(
    {
      format: `{bar} {percentage}% | {value}/{total} creating Resources for {v3ProfileId} | [{resource}]`,
    },
    cliProgress.Presets.shades_grey,
  )

  BAR.start(Object.keys(Profile_v2v3_IdMapping).length, 0)

  for (const v2_profile_id in Profile_v2v3_IdMapping) {
    const v3ProfileId = Profile_v2v3_IdMapping[v2_profile_id]

    assert(v3ProfileId)
    BAR.update({ v3ProfileId, resource: 'no own resources' })
    const [v2_profile_type, v2_profile_key] = v2_profile_id.split('/')
    assert(v2_profile_type && v2_profile_key)
    await initiateCallForProfileKey({
      _key: v3ProfileId,
      async exec() {
        const ownResourcesCursor = await v2_DB_ContentGraph.query<
          v2.Resource & { featIds: string[] }
        >(
          `FOR res in Resource 
          FILTER res._creator._permId == "${v2_profile_key}" && res._creator._type == "${v2_profile_type}"
          let featIds = (FOR feat IN Features FILTER feat._from == res._id RETURN feat._to)
          RETURN MERGE(res, {featIds})`,
          {},
          { count: true, batchSize: 100 },
        )
        while (ownResourcesCursor.hasNext) {
          const v2_resource = await ownResourcesCursor.next()
          assert(v2_resource, `NO RESOURCE FROM QUERY CAN'T HAPPEN`)
          BAR.update({ resource: v2_resource.name })

          const featsMap = mapResourceFeats(v2_resource)

          const pubDate =
            v2_resource.originalCreationDate && new Date(v2_resource.originalCreationDate)

          const [year, month] = pubDate
            ? [`${pubDate.getFullYear()}`, `${pubDate.getMonth() + 1}`]
            : ['', '']

          const newResource = await createResource({
            description: v2_resource.description,
            title: v2_resource.name,
            published: v2_resource._published,
            content: null, //{ kind: 'link', url: '' },
            image: null, //{ kind: 'file', directAccessId: '' },
            month,
            year,
            ...featsMap,
          })
          assert(newResource)

          Resource_v2v3_IdMapping[v2_resource._id] = newResource._id
          Resource_v3v2_IdMapping[newResource._id] = v2_resource._id
        }
      },
    })
    BAR.update({ resource: 'done' })
    BAR.increment()
  }
  BAR.stop()
}

function mapResourceFeats(
  v2_resource: v2.Resource & {
    featIds: string[]
  },
) {
  type V3_Props_From_FeatureEdge = 'language' | 'level' | 'subject' | 'license' | 'type'
  const featsMap = v2_resource.featIds.reduce((_acc, featId) => {
    // "IscedField","IscedGrade","Language","License","Resource","ResourceType"
    const field: V3_Props_From_FeatureEdge = featId.startsWith('IscedGrade')
      ? 'level'
      : featId.startsWith('IscedField')
      ? 'subject'
      : featId.startsWith('Language')
      ? 'language'
      : featId.startsWith('License')
      ? 'license'
      : featId.startsWith('ResourceType')
      ? 'type'
      : (null as never)
    assert(field)
    const featkey = featId.split('/')[1]
    assert(featkey)
    return { ..._acc, [field]: featkey }
  }, {} as Pick<ResourceDataType, V3_Props_From_FeatureEdge>)

  return featsMap
}
