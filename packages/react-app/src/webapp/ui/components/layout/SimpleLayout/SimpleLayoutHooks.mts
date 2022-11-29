import { useContext, useMemo } from 'react'
import { SettingsCtx } from '../../../../context/SettingsContext.js'
import { useMinimalisticHeaderProps } from '../../organisms/Header/Minimalistic/MinimalisticHeaderHooks.mjs'
import { SimpleLayoutProps } from './SimpleLayout.js'

export const useSimpleLayoutProps = (): SimpleLayoutProps => {
  const {
    appearanceData: { customStyle },
  } = useContext(SettingsCtx)
  const headerProps = useMinimalisticHeaderProps()
  const simpleLayoutProps = useMemo<SimpleLayoutProps>(() => {
    return {
      headerProps,
      style: customStyle,
    }
  }, [customStyle, headerProps])

  return simpleLayoutProps
}
