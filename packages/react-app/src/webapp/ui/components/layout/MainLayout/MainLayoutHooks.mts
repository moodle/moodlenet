import { useContext, useMemo } from 'react'
import { SettingsCtx } from '../../../../context/SettingsContext.js'
import { useFooterProps } from '../../organisms/Footer/MainFooter/MainFooterHooks.mjs'
import { useHeaderProps } from '../../organisms/Header/MainHeader/MainHeaderHooks.mjs'
import type { MainLayoutProps } from './MainLayout.js'

export const useMainLayoutProps = (): MainLayoutProps => {
  const {
    appearanceData: { customStyle },
  } = useContext(SettingsCtx)
  const headerProps = useHeaderProps()
  const footerProps = useFooterProps()
  const mainLayoutProps = useMemo<MainLayoutProps>(() => {
    return {
      headerProps,
      footerProps,
      style: customStyle,
    }
  }, [headerProps, footerProps, customStyle])

  return mainLayoutProps
}
