import type { MySystemEntitiesId } from '@moodlenet/system-entities/webapp/rt'
import { useMySystemEntitiesId } from '@moodlenet/system-entities/webapp/rt'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useMemo } from 'react'
import type { KnownEntityFeature, KnownEntityTypes, WebUserEntityNames } from '../common/types.mjs'
import { shell } from './shell.mjs'

export type KnownFeaturedEntities = {
  [feature in KnownEntityFeature]: {
    [knownEntity in KnownEntityTypes]: { _key: string }[]
  }
}
export type ProfileContextT = {
  profileEntitiesId: MySystemEntitiesId<WebUserEntityNames>
}
export const ProfileContext = createContext<ProfileContextT>(null as any)

export function useProfileContextValue() {
  const profileEntitiesId = useMySystemEntitiesId<WebUserEntityNames>(shell)

  const profileContext = useMemo<ProfileContextT>(() => {
    const profileContext: ProfileContextT = {
      profileEntitiesId,
    }
    return profileContext
  }, [profileEntitiesId])

  return profileContext
}

export const ProfileContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const profileContext = useProfileContextValue()
  return <ProfileContext.Provider value={profileContext}>{children}</ProfileContext.Provider>
}
