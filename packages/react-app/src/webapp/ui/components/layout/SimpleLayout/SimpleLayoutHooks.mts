import { useMemo } from 'react'
import { useMinimalisticHeaderProps } from '../../organisms/Header/Minimalistic/MinimalisticHeaderHooks.mjs'
import { SimpleLayoutProps } from './SimpleLayout.js'

export const useSimpleLayoutProps = (): SimpleLayoutProps => {
  const headerProps = useMinimalisticHeaderProps()
  const simpleLayoutProps = useMemo<SimpleLayoutProps>(() => {
    return {
      headerProps,
    }
  }, [headerProps])

  return simpleLayoutProps
}
