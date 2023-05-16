import { CollectionContext } from '@moodlenet/collection/webapp'
import { ResourceContext } from '@moodlenet/ed-resource/webapp'
import type { EntityIdentifiers } from '@moodlenet/system-entities/common'
import { getEntityIdentifiers } from '@moodlenet/system-entities/common'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext, useMemo } from 'react'
import type { FeaturedEntity, KnownEntityFeature, KnownEntityTypes } from '../../common/types.mjs'
import { MyProfileContext } from '../MyProfileContext.js'
import { ProfileContext } from '../ProfileContext.js'

type FeaturedKnownEntities = {
  [feature in `${KnownEntityFeature}s`]: {
    [knownEntity in `${KnownEntityTypes}s`]: EntityIdentifiers[]
  }
}
export type MyFeaturedKnownEntitiesContextT = {
  myFeaturedKnownEntities: FeaturedKnownEntities
}
export const MyFeaturedKnownEntitiesContext = createContext<MyFeaturedKnownEntitiesContextT | null>(
  null,
)

export function useMyFeaturedKnownEntitiesValue() {
  const collectionContext = useContext(CollectionContext)
  const resourceContext = useContext(ResourceContext)
  const profileContext = useContext(ProfileContext)
  const myFeaturedEntities = useContext(MyProfileContext)?.myFeaturedEntities
  const myFeaturedKnownEntities = useMemo(() => {
    if (!myFeaturedEntities) {
      return null
    }

    const myFeaturedKnownEntities: FeaturedKnownEntities = {
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
    return myFeaturedKnownEntities
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
        .map(({ _id }) => getEntityIdentifiers(_id))
    }
  }, [
    collectionContext.collectionEntitiesId,
    myFeaturedEntities,
    profileContext.profileEntitiesId,
    resourceContext.resourceEntitiesId,
  ])

  const myFeaturedKnownEntitiesContext = useMemo<MyFeaturedKnownEntitiesContextT | null>(() => {
    if (!myFeaturedKnownEntities) {
      return null
    }
    const myFeaturedKnownEntitiesContext: MyFeaturedKnownEntitiesContextT = {
      myFeaturedKnownEntities,
    }
    return myFeaturedKnownEntitiesContext
  }, [myFeaturedKnownEntities])

  return myFeaturedKnownEntitiesContext
}

export const MyFeaturedKnownEntitiesContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const profileContext = useMyFeaturedKnownEntitiesValue()
  return (
    <MyFeaturedKnownEntitiesContext.Provider value={profileContext}>
      {children}
    </MyFeaturedKnownEntitiesContext.Provider>
  )
}
