import type { EntityIdentifiers } from '@moodlenet/system-entities/common'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { ResourceContext } from './ResourceContext.js'

export type CurrentResourceContextT = {
  identifiers: EntityIdentifiers
}
export const CurrentResourceContext = createContext<CurrentResourceContextT | null>(null as any)
export function useCurrentResourceContextValue(_key: string) {
  const resourceContext = useContext(ResourceContext)
  const identifiers = resourceContext.resourceEntitiesId.getIdentifiersByKey({
    _key,
    type: 'Resource',
  })

  const currentResourceContext = useMemo<CurrentResourceContextT>(() => {
    const resourceContext: CurrentResourceContextT = {
      identifiers,
    }
    return resourceContext
  }, [identifiers])

  return currentResourceContext
}

export const ProvideCurrentResourceContext: FC<PropsWithChildren<{ _key: string }>> = ({
  children,
  _key,
}) => {
  const currentResourceContextValue = useCurrentResourceContextValue(_key)
  return (
    <CurrentResourceContext.Provider value={currentResourceContextValue}>
      {children}
    </CurrentResourceContext.Provider>
  )
}
