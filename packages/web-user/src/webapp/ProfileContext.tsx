import type { FC, PropsWithChildren } from 'react'
import { createContext, useMemo } from 'react'

export type ProfileContextT = { null: null }
export const ProfileContext = createContext<ProfileContextT>(null as any)

export function useProfileContextValue() {
  const profileContext = useMemo<ProfileContextT>(() => {
    const profileContext: ProfileContextT = { null: null }
    return profileContext
  }, [])

  return profileContext
}

export const ProfileContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const profileContext = useProfileContextValue()
  return <ProfileContext.Provider value={profileContext}>{children}</ProfileContext.Provider>
}
