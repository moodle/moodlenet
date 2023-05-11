import type { MySystemEntitiesId } from '@moodlenet/system-entities/webapp/rt'
import { useMySystemEntitiesId } from '@moodlenet/system-entities/webapp/rt'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { FeaturedEntity, WebUserEntityNames } from '../common/types.mjs'
import { MainContext } from './context/MainContext.mjs'

export type ProfileContextT = {
  profileEntitiesId: MySystemEntitiesId<WebUserEntityNames>
  myFeaturedEntities: FeaturedEntity[]
  setMyFeaturedEntities: React.Dispatch<React.SetStateAction<FeaturedEntity[]>>
}
export const ProfileContext = createContext<ProfileContextT>(null as any)

export function useProfileContextValue() {
  const {
    use: { me },
  } = useContext(MainContext)
  const profileEntitiesId = useMySystemEntitiesId<WebUserEntityNames>()
  const [myFeaturedEntities, setMyFeaturedEntities] = useState<FeaturedEntity[]>([])

  useEffect(() => {
    me.rpc['webapp/all-my-featured-entities']().then(({ featuredEntities }) =>
      setMyFeaturedEntities(featuredEntities),
    )
  }, [me.rpc])

  const profileContext = useMemo<ProfileContextT>(() => {
    const profileContext: ProfileContextT = {
      profileEntitiesId,
      myFeaturedEntities,
      setMyFeaturedEntities,
    }
    return profileContext
  }, [profileEntitiesId, myFeaturedEntities])

  return profileContext
}

export const ProfileContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const profileContext = useProfileContextValue()
  return <ProfileContext.Provider value={profileContext}>{children}</ProfileContext.Provider>
}
