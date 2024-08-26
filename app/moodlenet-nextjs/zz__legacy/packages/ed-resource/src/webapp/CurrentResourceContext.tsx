import type { EntityIdentifiers } from '@moodlenet/system-entities/common'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useMemo } from 'react'
import type { ProxiedResourceProps } from './components/pages/Resource/ResourcePageHooks.js'
import { EdResourceEntitiesTools } from './entities.mjs'

export type CurrentResourceContextT = {
  identifiers: EntityIdentifiers | null
  resourceProps: null | undefined | ProxiedResourceProps
}
const defaultContext: CurrentResourceContextT = { identifiers: null, resourceProps: null }
export const CurrentResourceContext = createContext<CurrentResourceContextT>(defaultContext)

export function useCurrentResourceContextValue(
  _key: string,
  resourceProps: ProxiedResourceProps | null | undefined,
) {
  const identifiers = EdResourceEntitiesTools.getIdentifiersByKey({
    _key,
    type: 'Resource',
  })

  const currentResourceContext = useMemo<CurrentResourceContextT>(() => {
    const resourceContext: CurrentResourceContextT = {
      identifiers,
      resourceProps,
    }
    return resourceContext
  }, [identifiers, resourceProps])

  return currentResourceContext
}

export const ProvideCurrentResourceContext: FC<
  PropsWithChildren<{ _key: string; resourceProps: ProxiedResourceProps | null | undefined }>
> = ({ children, _key, resourceProps }) => {
  const currentResourceContextValue = useCurrentResourceContextValue(_key, resourceProps)
  return (
    <CurrentResourceContext.Provider value={currentResourceContextValue}>
      {children}
    </CurrentResourceContext.Provider>
  )
}
