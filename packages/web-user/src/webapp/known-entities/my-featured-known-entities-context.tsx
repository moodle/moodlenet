import { CollectionEntitiesTools } from '@moodlenet/collection/webapp'
import { EdResourceEntitiesTools } from '@moodlenet/ed-resource/webapp'
import type { EntityIdentifiers } from '@moodlenet/system-entities/common'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext, useMemo } from 'react'
import type { KnownEntityFeature, KnownEntityTypes } from '../../common/types.mjs'
import { WebUserEntitiesTools } from '../entities.mjs'
import { MyProfileContext } from '../MyProfileContext.js'

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
  const myFeaturedEntities = useContext(MyProfileContext)?.myFeaturedEntities
  const myFeaturedKnownEntities = useMemo(() => {
    if (!myFeaturedEntities) {
      return null
    }

    const myFeaturedKnownEntities: FeaturedKnownEntities = {
      bookmarks: {
        collections: extractFeaturedIdentifiers('Collection', 'bookmark'),
        profiles: extractFeaturedIdentifiers('Profile', 'bookmark'),
        resources: extractFeaturedIdentifiers('Resource', 'bookmark'),
      },
      follows: {
        collections: extractFeaturedIdentifiers('Collection', 'follow'),
        profiles: extractFeaturedIdentifiers('Profile', 'follow'),
        resources: extractFeaturedIdentifiers('Resource', 'follow'),
      },
      likes: {
        collections: extractFeaturedIdentifiers('Collection', 'like'),
        profiles: extractFeaturedIdentifiers('Profile', 'like'),
        resources: extractFeaturedIdentifiers('Resource', 'like'),
      },
    }
    return myFeaturedKnownEntities
    function extractFeaturedIdentifiers(
      extractEntity: Capitalize<KnownEntityTypes>,
      extractFeature: KnownEntityFeature,
    ) {
      const entitiesTool =
        extractEntity === 'Collection'
          ? CollectionEntitiesTools
          : extractEntity === 'Resource'
          ? EdResourceEntitiesTools
          : WebUserEntitiesTools
      const filteredByFeature = (myFeaturedEntities ?? []).filter(
        ({ feature }) => extractFeature === feature,
      )
      return entitiesTool.mapToIdentifiersFilterType({
        ids: filteredByFeature,
        type: extractEntity as any, //typescript compiler gets confused with that dynamic `entitiesTool`
      })
    }
  }, [myFeaturedEntities])

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
