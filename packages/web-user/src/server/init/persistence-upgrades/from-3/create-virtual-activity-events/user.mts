import type { CollectionDataType } from '@moodlenet/collection/server'
import { Collection } from '@moodlenet/collection/server'
import type { EventPayload } from '@moodlenet/core'
import type { ResourceDataType } from '@moodlenet/ed-resource/server'
import { Resource } from '@moodlenet/ed-resource/server'
import type { SomeEntityDataType } from '@moodlenet/system-entities/common'
import type { EntityFullDocument } from '@moodlenet/system-entities/server'
import { getPkgCurrentUser, sysEntitiesDB } from '@moodlenet/system-entities/server'
import type {
  KnownFeaturedEntityItem,
  ProfileDataType,
  WebUserActivityEvents,
} from '../../../../exports.mjs'
import { getWebUserByProfileKey } from '../../../../exports.mjs'
import { shell } from '../../../../shell.mjs'
import { getProfileMeta } from '../../../../srv/profile.mjs'
import { saveWebUserActivities } from '../../../activity-log.mjs'
import { Profile } from '../../../sys-entities.mjs'
import collectionActivityEvents from './collectionActivityEvents.mjs'
import { randomDate } from './randomDate.mjs'
import resourceActivityEvents from './resourceActivityEvents.mjs'

type ProfileRecord = {
  ownResources: EntityFullDocument<ResourceDataType>[]
  ownCollections: EntityFullDocument<CollectionDataType>[]
  profile: EntityFullDocument<ProfileDataType>
  featuredEntities: {
    item: KnownFeaturedEntityItem
    maybeFoundTarget: null | EntityFullDocument<SomeEntityDataType>
  }[]
}
await shell.initiateCall(async () => {
  const profileCursor = await sysEntitiesDB.query<ProfileRecord>(
    `
FOR profile IN \`${Profile.collection.name}\`
let ownResources = ( FOR resource IN \`${Resource.collection.name}\`
                      FILTER resource._meta.creatorEntityId == profile._id
                      RETURN resource 
                    )

let ownCollections = ( FOR collection IN \`${Collection.collection.name}\`
                        FILTER collection._meta.creatorEntityId == profile._id
                        RETURN collection 
                      )

let featuredEntities = ( FOR item IN profile.knownFeaturedEntities
                          RETURN { item , maybeFoundTarget: DOCUMENT(item._id) }
                        )

RETURN { 
    ownResources,
    ownCollections,
    featuredEntities,
    profile
}
`,
    {},
    {
      batchSize: 100,
      ttl: 300,
      fullCount: false,
      fillBlockCache: false,
      memoryLimit: 0,
    },
  )
  const thisPkgUser = await getPkgCurrentUser()
  const pkgId = shell.myId
  // let done = 0
  // let sec = 0
  // const logInterval = setInterval(() => {
  //   process.stdout.clearLine(-1) // clear current text
  //   process.stdout.cursorTo(0) // move cursor to beginning of line
  //   process.stdout.write(`User done: ${done} sec:${++sec}`) // write text
  // }, 1000)
  while (profileCursor.batches.hasNext) {
    const records = (await profileCursor.batches.next()) ?? []
    // console.log('records.length', records.length)
    await Promise.all(
      records.map(async record => {
        const userActivities: EventPayload<WebUserActivityEvents>[] = []
        // const record = await profcileCursor.next()
        if (!record) {
          return
        }
        const { ownCollections, ownResources, profile, featuredEntities } = record
        const profileKey = profile._key
        const webUser = await getWebUserByProfileKey({ profileKey })
        if (!webUser) {
          console.warn(`No web user found for profile ${profileKey}`)
          return
        }
        const webUserKey = webUser._key

        const profileCreatedAtDate = new Date(profile._meta.created)
        const profileUpdatedAtDate = new Date(profile._meta.updated)
        // created-web-user-account
        userActivities.push({
          event: 'created-web-user-account',
          pkgId,
          at: profileCreatedAtDate.toISOString(),
          data: {
            profileKey,
            webUserKey,
          },
        })

        // edit-profile-meta
        if (
          Math.floor(profileCreatedAtDate.getTime() / 10000) !==
          Math.floor(profileUpdatedAtDate.getTime() / 10000)
        ) {
          userActivities.push({
            event: 'edit-profile-meta',
            pkgId,
            at: profileUpdatedAtDate.toISOString(),
            data: {
              profileKey,
              meta: getProfileMeta(profile),
            },
          })
        }

        // user-publishing-permission-change
        if (profile.publisher) {
          userActivities.push({
            event: 'user-publishing-permission-change',
            pkgId,
            at: randomDate(new Date(profile._meta.updated), new Date()).toISOString(),
            data: {
              moderator: thisPkgUser,
              profileKey,
              type: 'given',
            },
          })
        }

        // feature-entity
        featuredEntities.forEach(
          /* <Promise<KnownFeaturedEntityItem>> */ ({ item, maybeFoundTarget }, index) => {
            // const maybeFoundTarget = await (
            //   await sysEntitiesDB.query<EntityFullDocument<SomeEntityDataType>>(
            //     `RETURN DOCUMENT("${item._id}")`,
            //   )
            // ).next()
            const targetUpdatedDate = maybeFoundTarget
              ? new Date(maybeFoundTarget._meta.updated)
              : randomDate(profileCreatedAtDate, new Date())
            const featuredAt = randomDate(profileCreatedAtDate, targetUpdatedDate)
            userActivities.push({
              event: 'feature-entity',
              pkgId,
              at: featuredAt.toISOString(),
              data: {
                profileKey,
                action: 'add',
                item,
                currentItemsOfSameType: profile.knownFeaturedEntities.slice(0, index),
              },
            })
            // return {
            //   _id: item._id,
            //   feature: item.feature,
            //   at: featuredAt.toISOString(),
            // }
          },
        )

        userActivities.push(...resourceActivityEvents(profile, ownResources))
        userActivities.push(...collectionActivityEvents(profile, ownCollections))

        saveWebUserActivities(userActivities)

        // ++done
      }),
    )
  }
  // clearInterval(logInterval)
})
