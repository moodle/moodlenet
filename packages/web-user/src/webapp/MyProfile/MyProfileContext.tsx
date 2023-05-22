import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { AuthCtx } from '../context/AuthContext.js'
import type { AllMyFeaturedEntitiesHandle } from './MyFeaturedEntities.js'
import { useAllMyFeaturedEntities } from './MyFeaturedEntities.js'

export type MyProfileContextT = {
  myFeaturedEntities: AllMyFeaturedEntitiesHandle
}
export const MyProfileContext = createContext<MyProfileContextT | null>(null)
export function useMyProfileContext() {
  return useContext(MyProfileContext)
}

export const MyProfileContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const myProfileContext = useMyProfileContextValue()
  return <MyProfileContext.Provider value={myProfileContext}>{children}</MyProfileContext.Provider>
}

function useMyProfileContextValue() {
  const authCtx = useContext(AuthCtx)
  const myProfile = authCtx.clientSessionData?.myProfile
  const myFeaturedEntities = useAllMyFeaturedEntities()

  const myProfileContext = useMemo<MyProfileContextT | null>(() => {
    if (!myProfile) {
      return null
    }
    const myProfileContext: MyProfileContextT = {
      myFeaturedEntities,
    }
    return myProfileContext
  }, [myFeaturedEntities, myProfile])

  return myProfileContext
}
