import type { EntityFullDocument } from '@moodlenet/system-entities/server'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { Profile } from '../init/sys-entities.mjs'
import type { ProfileDataType } from '../types.mjs'

export async function deltaPoints({ delta, profileKey }: { profileKey: string; delta: number }) {
  const cursor = await sysEntitiesDB.query<EntityFullDocument<ProfileDataType>>(
    `
FOR profile IN \`${Profile.collection.name}\`
  FILTER profile._key == @profileKey
  LIMIT 1
  let updatedPoints = profile.points + @delta
  UPDATE profile WITH { points: updatedPoints } IN \`${Profile.collection.name}\`
  RETURN NEW
`,
    {
      delta,
      profileKey,
    },
  )
  const profile = await cursor.next()
  return profile
}

export const pointSystem = {
  account: {
    creation: 5,
  },
  featureEntity: {
    resource: {
      like: {
        add: { giver: 1, receiver: 1 },
        remove: { giver: -1, receiver: -1 },
      },
      bookmark: {
        add: { giver: 1, receiver: 1 },
        remove: { giver: -1, receiver: -1 },
      },
      follow: null,
    },
    collection: {
      bookmark: {
        add: { giver: 1, receiver: 1 },
        remove: { giver: -1, receiver: -1 },
      },
      follow: null,
      like: null,
    },
    profile: {
      bookmark: {
        add: { giver: 1, receiver: 1 },
        remove: { giver: -1, receiver: -1 },
      },
      follow: null,
      like: null,
    },
    subject: {
      follow: null,
      bookmark: null,
      like: null,
    },
  },
  contribution: {
    resource: {
      publish: { creator: 20 },
      unpublish: { creator: -20 },
    },
    collection: {
      publish: { creator: 5 },
      unpublish: { creator: -5 },
      resourceInCollection: {
        add: { resourceCreator: 5, collectionCreator: 5 },
        remove: { resourceCreator: -5, collectionCreator: -5 },
      },
    },
  },
  engagment: {
    publisherGrant: { gain: 10, loose: -10 },
    profile: {
      updateMeta: { pointsPerField: 1 },
      interests: { points: 1 },
    },
    resource: {
      updateMeta: { points: 5 },
    },
    collection: {
      updateMeta: { points: 5 },
    },
  },
}
