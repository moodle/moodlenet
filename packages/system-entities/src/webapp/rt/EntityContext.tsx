import type { PropsWithChildren } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { getIdAndEntityIdentifier } from '../../common/entity-identification.mjs'
import type { EntityIdentifier } from '../../common/types.mjs'

export type SystemEntityContextT = {
  _id: string
  entityIdentifier: EntityIdentifier
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
    const { _id, entityIdentifier } = getIdAndEntityIdentifier(id)
    return {
      _id,
      entityIdentifier,
    }
  }, [id])
  return <SystemEntityContext.Provider value={ctx}>{children}</SystemEntityContext.Provider>
}
