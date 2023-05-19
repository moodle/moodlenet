import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { AuthCtx } from '../context/AuthContext.js'
import type { MyFeaturedEntitiesHandle } from './MyFeaturedEntities.js'
import { useMyFeaturedEntities } from './MyFeaturedEntities.js'

export type MyWebUserContextT = {
  myFeaturedEntities: MyFeaturedEntitiesHandle
}
export const MyWebUserContext = createContext<MyWebUserContextT | null>(null)

export const MyWebUserContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const myWebUserContext = useMyWebUserContextValue()
  return <MyWebUserContext.Provider value={myWebUserContext}>{children}</MyWebUserContext.Provider>
}

function useMyWebUserContextValue() {
  const authCtx = useContext(AuthCtx)
  const myProfile = authCtx.clientSessionData?.myProfile
  const myFeaturedEntities = useMyFeaturedEntities()

  const myWebUserContext = useMemo<MyWebUserContextT | null>(() => {
    if (!myProfile) {
      return null
    }
    const myWebUserContext: MyWebUserContextT = {
      myFeaturedEntities,
    }
    return myWebUserContext
  }, [myFeaturedEntities, myProfile])

  return myWebUserContext
}
