import { createContext, FC, PropsWithChildren, useMemo } from 'react'

export type ContentGraphContextType = {}

export const ContentGraphContext = createContext<ContentGraphContextType>(null as any)

export const ContentGraphProvider: FC<PropsWithChildren> = ({ children }) => {
  const ctx = useMemo<ContentGraphContextType>(() => {
    return {}
  }, [])

  return <ContentGraphContext.Provider value={ctx}>{children}</ContentGraphContext.Provider>
}
