import type { CollectionDataType } from '@moodlenet/collection/server'
import { Collection } from '@moodlenet/collection/server'
import type { EventPayload } from '@moodlenet/core'
import type { IscedFieldDataType } from '@moodlenet/ed-meta/server'
import { IscedField } from '@moodlenet/ed-meta/server'
import type { ResourceDataType } from '@moodlenet/ed-resource/server'
import { Resource } from '@moodlenet/ed-resource/server'
import type { EntityFullDocument } from '@moodlenet/system-entities/server'
import { getPkgCurrentUser, sysEntitiesDB } from '@moodlenet/system-entities/server'
import type {
  KnownFeaturedEntityItem,
  ProfileDataType,
  WebUserActivityEvents,
} from '../../../../exports.mjs'
import { getWebUserByProfileKey } from '../../../../exports.mjs'
import { shell } from '../../../../shell.mjs'
import { digestActivityEvent } from '../../../../srv/digestActivities/activity-events-handler.mjs'
import { getProfileMeta } from '../../../../srv/profile.mjs'
import { saveWebUserActivity } from '../../../activity-log.mjs'
import { Profile } from '../../../sys-entities.mjs'
import collectionActivityEvents from './collectionActivityEvents.mjs'
import { initialEventsNowISO } from './initialEventsNow.mjs'
import resourceActivityEvents from './resourceActivityEvents.mjs'

type ProfileRecord = {
  ownResources: EntityFullDocument<ResourceDataType>[]
  ownCollections: EntityFullDocument<CollectionDataType>[]
  profile: EntityFullDocument<ProfileDataType>
  featuredItemsAndTargets: {
    item: KnownFeaturedEntityItem
    featTarget: EntityFullDocument<
      ProfileDataType | ResourceDataType | CollectionDataType | IscedFieldDataType
    >
  }[]
}

await shell.initiateCall(async () => {
  const profilesQuery = `
FOR profile IN \`${Profile.collection.name}\`
let ownResources = ( FOR resource IN \`${Resource.collection.name}\`
                      FILTER resource._meta.creatorEntityId == profile._id
                      RETURN resource 
                    )

let ownCollections = ( FOR collection IN \`${Collection.collection.name}\`
                        FILTER collection._meta.creatorEntityId == profile._id
                        RETURN collection 
                      )

let filteredKnownFeaturedItemsAndTargets= ( FOR item IN profile.knownFeaturedEntities
                          LET featTarget = DOCUMENT(item._id)
                          filter featTarget != null
                          RETURN { item , featTarget }
                        )
LET filteredKnownFeaturedItemsAndTargetsWithDateAndMoreProps = ( 
  FOR rec IN filteredKnownFeaturedItemsAndTargets
    let featCollName = PARSE_IDENTIFIER(rec.item._id).collection
    let entityType = featCollName == "${Resource.collection.name}" 
                      ? "resource"
                      : featCollName == "${Collection.collection.name}" 
                      ? "collection"
                      : featCollName == "${Profile.collection.name}" 
                      ? "profile"
                      : featCollName == "${IscedField.collection.name}" 
                      ? "subject"
                      : null
    FILTER entityType != null
    RETURN {
      featTarget: rec.featTarget,
      item: MERGE(
        rec.item, 
        { 
          _key:rec.featTarget._key,
          entityType,
          at: "${initialEventsNowISO}" 
        }
      )
    }
  )
REPLACE profile 
        WITH MERGE( 
            UNSET(profile, 'kudos'), 
            { 
              points: 0,
              knownFeaturedEntities: filteredKnownFeaturedItemsAndTargetsWithDateAndMoreProps[*].item 
            }
          )
          IN \`${Profile.collection.name}\` 
RETURN { 
    ownResources,
    ownCollections,
    featuredItemsAndTargets: filteredKnownFeaturedItemsAndTargetsWithDateAndMoreProps,
    profile: NEW
}
`
  // console.log(profilesQuery)

  shell.log('info', `reset entities popularity`)
  for (const Ent of [Profile, Resource, Collection, IscedField]) {
    const collName = Ent.collection.name
    ;(
      await sysEntitiesDB.query(`
  FOR ent IN \`${collName}\`
    REPLACE ent WITH MERGE(ent, {
      popularity:{
        overall: 0,
        items:{}
      }
    }) IN \`${collName}\`
  `)
    ).kill()
  }

  shell.log('info', `Migrating users' data`)
  const profileCursor = await sysEntitiesDB.query<ProfileRecord>(
    profilesQuery,
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
  let done = 0

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
        const { ownCollections, ownResources, profile, featuredItemsAndTargets } = record
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
              oldMeta: getProfileMeta(profile),
              meta: getProfileMeta(profile),
            },
          })
        }

        // user-publishing-permission-change
        if (profile.publisher) {
          userActivities.push({
            event: 'user-publishing-permission-change',
            pkgId,
            at: initialEventsNowISO,
            data: {
              moderator: thisPkgUser,
              profile: { ...profile, knownFeaturedEntities: [] },
              type: 'given',
            },
          })
        }

        // feature-entity
        featuredItemsAndTargets.forEach(
          /* <Promise<KnownFeaturedEntityItem>> */ ({ item, featTarget }, index) => {
            userActivities.push({
              event: 'feature-entity',
              pkgId,
              at: initialEventsNowISO,
              data: {
                profile: {
                  ...profile,
                  knownFeaturedEntities: profile.knownFeaturedEntities.slice(0, index),
                },
                action: 'add',
                item,
                targetEntityDoc: featTarget,
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
        userActivities.push(...(await collectionActivityEvents(profile, ownCollections)))

        await saveAndDigestWebUserActivities(userActivities)
        ++done % 1000 || shell.log('info', `${done / 1000}K users done`)

        // ++done
      }),
    )
  }
  // clearInterval(logInterval)
})
async function saveAndDigestWebUserActivities(
  userActivities: EventPayload<WebUserActivityEvents>[],
) {
  const initialUserActivities = userActivities.map(userActivity => ({
    ...userActivity,
    digested: true,
    _initial: true as const,
  }))

  for (const activityEvent of initialUserActivities) {
    saveWebUserActivity(activityEvent)
    await digestActivityEvent(activityEvent)
  }
}
