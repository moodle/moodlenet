import {
  useFooterProps,
  useMinimalisticHeaderProps,
  usePkgAddOns,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
// import { useFooterProps } from '../../../organisms/Footer/MainFooter/MainFooterHooks.mjs'
// import { useMinimalisticHeaderProps } from '../../../organisms/Header/Minimalistic/MinimalisticHeaderHooks.mjs'
import type { LoginItem, LoginProps } from './Login.js'

export type LoginPluginItem = Omit<LoginItem, 'key'>

export const useLoginProps = (): LoginProps => {
  const headerProps = useMinimalisticHeaderProps()
  const footerProps = useFooterProps()
  const [loginPlugins /*,registerLogin */] = usePkgAddOns<LoginPluginItem>('LoginPlugin')

  const loginProps = useMemo<LoginProps>(() => {
    const loginItems = loginPlugins.map(({ addOn: { Icon, Panel }, key }) => ({
      Icon,
      Panel,
      key,
    }))
    return {
      headerProps,
      footerProps,
      loginItems,
    }
  }, [loginPlugins, headerProps, footerProps])
  return loginProps
}
