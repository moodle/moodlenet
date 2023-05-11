import { CollectionContext } from '@moodlenet/collection/webapp'
import { ResourceContext } from '@moodlenet/ed-resource/webapp'
import type { EntityIdentifier } from '@moodlenet/system-entities/common'
import { getIdAndEntityIdentifier } from '@moodlenet/system-entities/common'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext, useMemo } from 'react'
import type { FeaturedEntity, KnownEntityFeature, KnownEntityTypes } from '../common/types.mjs'
import { MyProfileContext } from './MyProfileContext.js'
import { ProfileContext } from './ProfileContext.js'

type KnownFeaturedEntities = {
  [feature in `${KnownEntityFeature}s`]: {
    [knownEntity in `${KnownEntityTypes}s`]: { _id: string; entityIdentifier: EntityIdentifier }[]
  }
}
export type MyKnownFeaturedEntitiesContextT = {
  myKnownFeaturedEntities: KnownFeaturedEntities
}
export const MyKnownFeaturedEntitiesContext = createContext<MyKnownFeaturedEntitiesContextT | null>(
  null,
)

export function useMyKnownFeaturedEntitiesValue() {
  const collectionContext = useContext(CollectionContext)
  const resourceContext = useContext(ResourceContext)
  const profileContext = useContext(ProfileContext)
  const myFeaturedEntities = useContext(MyProfileContext)?.myFeaturedEntities
  const myKnownFeaturedEntities = useMemo(() => {
    if (!myFeaturedEntities) {
      return null
    }

    const myKnownFeaturedEntities: KnownFeaturedEntities = {
      bookmarks: {
        collections: extractKnownEntityKeysFeature({
          featuredEntities: myFeaturedEntities,
          knownEntity: 'collection',
          knownEntityFeature: 'bookmark',
        }),
        profiles: extractKnownEntityKeysFeature({
          featuredEntities: myFeaturedEntities,
          knownEntity: 'profile',
          knownEntityFeature: 'bookmark',
        }),
        resources: extractKnownEntityKeysFeature({
          featuredEntities: myFeaturedEntities,
          knownEntity: 'resource',
          knownEntityFeature: 'bookmark',
        }),
      },
      follows: {
        collections: extractKnownEntityKeysFeature({
          featuredEntities: myFeaturedEntities,
          knownEntity: 'collection',
          knownEntityFeature: 'follow',
        }),
        profiles: extractKnownEntityKeysFeature({
          featuredEntities: myFeaturedEntities,
          knownEntity: 'profile',
          knownEntityFeature: 'follow',
        }),
        resources: extractKnownEntityKeysFeature({
          featuredEntities: myFeaturedEntities,
          knownEntity: 'resource',
          knownEntityFeature: 'follow',
        }),
      },
      likes: {
        collections: extractKnownEntityKeysFeature({
          featuredEntities: myFeaturedEntities,
          knownEntity: 'collection',
          knownEntityFeature: 'like',
        }),
        profiles: extractKnownEntityKeysFeature({
          featuredEntities: myFeaturedEntities,
          knownEntity: 'profile',
          knownEntityFeature: 'like',
        }),
        resources: extractKnownEntityKeysFeature({
          featuredEntities: myFeaturedEntities,
          knownEntity: 'resource',
          knownEntityFeature: 'like',
        }),
      },
    }
    return myKnownFeaturedEntities
    function extractKnownEntityKeysFeature({
      featuredEntities,
      knownEntity,
      knownEntityFeature,
    }: {
      featuredEntities: FeaturedEntity[]
      knownEntity: KnownEntityTypes
      knownEntityFeature: KnownEntityFeature
    }) {
      const checkers = {
        collection: (_id: string) =>
          collectionContext.collectionEntitiesId.isIdOfType(_id, 'Collection'),
        resource: (_id: string) => resourceContext.resourceEntitiesId.isIdOfType(_id, 'Resource'),
        profile: (_id: string) => profileContext.profileEntitiesId.isIdOfType(_id, 'Profile'),
      }
      return featuredEntities
        .filter(({ _id, feature }) => knownEntityFeature === feature && checkers[knownEntity](_id))
        .map(({ _id }) => getIdAndEntityIdentifier(_id))
    }
  }, [
    collectionContext.collectionEntitiesId,
    myFeaturedEntities,
    profileContext.profileEntitiesId,
    resourceContext.resourceEntitiesId,
  ])

  const myKnownFeaturedEntitiesContext = useMemo<MyKnownFeaturedEntitiesContextT | null>(() => {
    if (!myKnownFeaturedEntities) {
      return null
    }
    const myKnownFeaturedEntitiesContext: MyKnownFeaturedEntitiesContextT = {
      myKnownFeaturedEntities,
    }
    return myKnownFeaturedEntitiesContext
  }, [myKnownFeaturedEntities])

  return myKnownFeaturedEntitiesContext
}

export const MyKnownFeaturedEntitiesContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const profileContext = useMyKnownFeaturedEntitiesValue()
  return (
    <MyKnownFeaturedEntitiesContext.Provider value={profileContext}>
      {children}
    </MyKnownFeaturedEntitiesContext.Provider>
  )
}
