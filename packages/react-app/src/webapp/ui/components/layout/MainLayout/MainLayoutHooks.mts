import { useMemo } from 'react'
import { useHeaderProps } from '../../organisms/Header/MainHeader/MainHeaderHooks.mjs'
import { MainLayoutProps } from './MainLayout.js'

export const useMainLayoutProps = (): MainLayoutProps => {
  const headerProps = useHeaderProps()
  const mainLayoutProps = useMemo<MainLayoutProps>(() => {
    return {
      headerProps,
    }
  }, [headerProps])

  return mainLayoutProps
}
