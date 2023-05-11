import type { PropsWithChildren } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { getEntityIdentifiers } from '../../common/entity-identification.mjs'
import type { EntityIdentifier, EntityIdentifiers } from '../../common/types.mjs'

export type SystemEntityContextT = {
  identifiers: EntityIdentifiers
}

const SystemEntityContext = createContext<SystemEntityContextT | null>(null)

export function useSystemEntityContext() {
  const ctx = useContext(SystemEntityContext)
  return ctx
}

export function ProvideSystemEntityContext({
  id,
  children,
}: PropsWithChildren<{ id: string | EntityIdentifier }>) {
  const ctx = useMemo<SystemEntityContextT>(() => {
    const identifiers = getEntityIdentifiers(id)
    return { identifiers }
  }, [id])
  return <SystemEntityContext.Provider value={ctx}>{children}</SystemEntityContext.Provider>
}
