import { createCollection, setCollectionImage } from '@moodlenet/collection/server'
import assert from 'assert'
import cliProgress from 'cli-progress'
import { shell } from '../shell.mjs'
import type * as v2 from '../v2-types/v2.mjs'
import { Resource_v2v3_IdMapping } from './resources.mjs'
import { getRpcFileByV2AssetLocation, initiateCallForProfileKey } from './util.mjs'
import { v2_DB_ContentGraph } from './v2-db.mjs'
import { Profile_v2v3_IdMapping } from './web-users.mjs'

export const Collection_v2v3_IdMapping: Record<string, string> = {}
export const Collection_v3v2_IdMapping: Record<string, string> = {}

export async function user_collections() {
  const BAR = new cliProgress.SingleBar(
    {
      format: `{bar} {percentage}% | {value}/{total} {duration_formatted}/{eta_formatted} | creating Collections for {v2_profile_id} | {collection}`,
    },
    cliProgress.Presets.shades_grey,
  )

  BAR.start(Object.keys(Profile_v2v3_IdMapping).length, 0)

  for (const v2_profile_id in Profile_v2v3_IdMapping) {
    const v3ProfileId = Profile_v2v3_IdMapping[v2_profile_id]

    assert(v3ProfileId)
    BAR.update({ v2_profile_id, collection: 'no own collections' })
    const [v2_profile_type, v2_profile_key] = v2_profile_id.split('/')
    assert(v2_profile_type && v2_profile_key)
    await initiateCallForProfileKey({
      _id: v3ProfileId,
      async exec() {
        const ownCollectionsCursor = await v2_DB_ContentGraph.query<
          v2.Collection & { resourceIds: string[] }
        >(
          `FOR coll in Collection 
          FILTER coll._creator._permId == "${v2_profile_key}" && coll._creator._type == "${v2_profile_type}"
          let resourceIds = (FOR feat IN Features FILTER feat._from == coll._id RETURN feat._to)
          RETURN MERGE(coll, {resourceIds})`,
          {},
          { count: true, batchSize: 1 },
        )
        while (ownCollectionsCursor.hasNext) {
          const v2_collection = await ownCollectionsCursor.next()
          assert(v2_collection, `NO COLLECTION FROM QUERY CAN'T HAPPEN`)
          BAR.update({ collection: `[${v2_collection._key}]:${v2_collection.name}` })

          const resourceList = v2_collection.resourceIds
            .map(v2_resId => {
              assert(v2_resId.startsWith('Resource'))
              const v3_resId = Resource_v2v3_IdMapping[v2_resId]
              if (!v3_resId) {
                // REMOVE ME !!!!
                // REMOVE ME !!!!
                // REMOVE ME !!!!
                // REMOVE ME !!!!
                // REMOVE ME !!!!
                // REMOVE ME !!!!
                // REMOVE ME !!!!
                return null as any
              }
              assert(
                v3_resId,
                `couldn't find v3 resource id from v2: ${v2_resId} in collection v2: ${v2_collection._key}`,
              )
              const v3_resKey = v3_resId.split('/')[1]
              assert(v3_resKey)
              return { _key: v3_resKey }
            })
            .filter(Boolean)
          shell.setNow(v2_collection._created)
          const newCollection = await createCollection({
            description: v2_collection.description,
            title: v2_collection.name,
            published: v2_collection._published,
            image:
              v2_collection.image?.ext === true
                ? {
                    kind: 'url',
                    url: v2_collection.image.location,
                    credits: v2_collection.image.credits,
                  }
                : null,
            resourceList,
          })
          assert(newCollection)

          if (v2_collection.image?.ext === false) {
            const imageFile = await getRpcFileByV2AssetLocation(
              v2_collection.image.location,
              `for image of collection id v2:${v2_collection._id} v3:${newCollection._id}`,
            )
            imageFile && (await setCollectionImage(newCollection._key, imageFile))
          }

          Collection_v2v3_IdMapping[v2_collection._id] = newCollection._id
          Collection_v3v2_IdMapping[newCollection._id] = v2_collection._id
        }
      },
    })
    BAR.increment()
  }
  BAR.stop()
}
