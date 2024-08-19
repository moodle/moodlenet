import { useContext, useMemo } from 'react'
import { AdminSettingsCtx } from '../../../../context/AdminSettingsContext.js'
import { useFooterProps } from '../../organisms/Footer/MainFooter/MainFooterHooks.mjs'
import { useMinimalisticHeaderProps } from '../../organisms/Header/Minimalistic/MinimalisticHeaderHooks.mjs'
import type { SimpleLayoutProps } from './SimpleLayout.js'

export const useSimpleLayoutProps = (): SimpleLayoutProps => {
  const {
    appearanceData: { customStyle },
  } = useContext(AdminSettingsCtx)
  const headerProps = useMinimalisticHeaderProps()
  const footerProps = useFooterProps()
  const simpleLayoutProps = useMemo<SimpleLayoutProps>(() => {
    return {
      headerProps,
      footerProps,
      style: customStyle,
    }
  }, [customStyle, headerProps, footerProps])

  return simpleLayoutProps
}
