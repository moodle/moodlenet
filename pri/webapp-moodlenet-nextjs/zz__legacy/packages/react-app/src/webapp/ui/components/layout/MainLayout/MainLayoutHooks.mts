import { useContext, useMemo } from 'react'
import type { MainLayoutProps } from '../../../../../../../../../app-nextjs-moodlenet/src/layouts/MainLayout'
import { AdminSettingsCtx } from '../../../../context/AdminSettingsContext'
import { useFooterProps } from '../../organisms/Footer/MainFooter/MainFooterHooks.mjs'
import { useHeaderProps } from '../../organisms/Header/MainHeader/MainHeaderHooks.mjs'

export const useMainLayoutProps = (): MainLayoutProps => {
  const {
    appearanceData: { customStyle },
  } = useContext(AdminSettingsCtx)
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
