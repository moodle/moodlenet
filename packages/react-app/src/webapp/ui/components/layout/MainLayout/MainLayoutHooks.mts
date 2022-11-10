import { useContext, useMemo } from 'react'
import { SettingsCtx } from '../../../../components.mjs'
import { useHeaderProps } from '../../organisms/Header/MainHeader/MainHeaderHooks.mjs'
import { MainLayoutProps } from './MainLayout.js'

export const useMainLayoutProps = (): MainLayoutProps => {
  const {
    appearanceData: { customStyle },
  } = useContext(SettingsCtx)
  const headerProps = useHeaderProps()
  const mainLayoutProps = useMemo<MainLayoutProps>(() => {
    return {
      headerProps,
      style: customStyle,
    }
  }, [headerProps, customStyle])

  return mainLayoutProps
}
