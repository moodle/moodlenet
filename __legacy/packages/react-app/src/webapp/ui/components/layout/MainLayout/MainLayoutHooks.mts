import { useContext, useMemo } from 'react'
import { AdminSettingsCtx } from '../../../../context/AdminSettingsContext.js'
import { useFooterProps } from '../../organisms/Footer/MainFooter/MainFooterHooks.mjs'
import { useHeaderProps } from '../../organisms/Header/MainHeader/MainHeaderHooks.mjs'
import type { MainLayoutProps } from '../../../../../../../../../app-nextjs-moodlenet/src/app/MainLayout.js'

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
