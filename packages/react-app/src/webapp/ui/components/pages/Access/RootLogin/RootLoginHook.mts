import { useMemo } from 'react'
import { useMinimalisticHeaderProps } from '../../../organisms/Header/Minimalistic/MinimalisticHeaderHooks.mjs'
import { RootLoginProps } from './RootLogin.js'

export const useRootLoginProps = (): RootLoginProps => {
  const headerProps = useMinimalisticHeaderProps()
  const rootLoginProps = useMemo<RootLoginProps>(() => {
    return {
      headerProps,
    }
  }, [headerProps])
  return rootLoginProps
}
