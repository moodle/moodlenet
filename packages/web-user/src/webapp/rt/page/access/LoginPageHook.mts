import type { AddOnMap } from '@moodlenet/core/lib'
import { href } from '@moodlenet/react-app/common'
import {
  createPlugin,
  useFooterProps,
  useMinimalisticHeaderProps,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type { LoginItem, LoginProps } from '../../../ui/exports/ui.mjs'
// import { useFooterProps } from '../../../organisms/Footer/MainFooter/MainFooterHooks.mjs'
// import { useMinimalisticHeaderProps } from '../../../organisms/Header/Minimalistic/MinimalisticHeaderHooks.mjs'
export type LoginMethodItem = Omit<LoginItem, 'key'>

export const LoginPlugins = createPlugin<{
  loginMethod: AddOnMap<LoginMethodItem>
}>()

export const useLoginProps = (): LoginProps => {
  const headerProps = useMinimalisticHeaderProps()
  const footerProps = useFooterProps()
  const plugins = LoginPlugins.usePluginHooks()

  const loginProps = useMemo<LoginProps>(() => {
    const loginProps: LoginProps = {
      headerProps,
      footerProps,
      loginItems: plugins.getKeyedAddons('loginMethod'),
      signupHref: href('/signup'),
    }
    return loginProps
  }, [headerProps, footerProps, plugins])
  return loginProps
}
