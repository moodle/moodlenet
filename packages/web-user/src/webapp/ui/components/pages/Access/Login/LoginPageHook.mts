import {
  createHookPlugin,
  useFooterProps,
  useMinimalisticHeaderProps,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
// import { useFooterProps } from '../../../organisms/Footer/MainFooter/MainFooterHooks.mjs'
// import { useMinimalisticHeaderProps } from '../../../organisms/Header/Minimalistic/MinimalisticHeaderHooks.mjs'
import type { LoginItem, LoginProps } from './Login.js'
export type LoginMethodItem = Omit<LoginItem, 'key'>

export const LoginPlugins = createHookPlugin<{
  loginMethod: LoginMethodItem
}>({ loginMethod: null })

export const useLoginProps = (): LoginProps => {
  const headerProps = useMinimalisticHeaderProps()
  const footerProps = useFooterProps()
  const [addons] = LoginPlugins.useHookPlugin()

  const loginProps = useMemo<LoginProps>(() => {
    const loginProps: LoginProps = {
      headerProps,
      footerProps,
      loginItems: addons.loginMethod,
    }
    return loginProps
  }, [headerProps, footerProps, addons.loginMethod])
  return loginProps
}
