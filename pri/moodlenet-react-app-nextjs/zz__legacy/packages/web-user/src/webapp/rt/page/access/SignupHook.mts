import type { AddOnMap } from '@moodlenet/core/lib'
import { href } from '@moodlenet/react-app/common'
import {
  createPlugin,
  useFooterProps,
  useMinimalisticHeaderProps,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import { USER_AGREEMENTS_PAGE_PATH, loginPageRoutePath } from '../../../../common/webapp-routes.mjs'
import type { SignupItem, SignupProps } from '../../../ui/exports/ui.mjs'
export type SignupMethodItem = Omit<SignupItem, 'key'>
export const SignupPlugins = createPlugin<{
  signupMethod: AddOnMap<SignupMethodItem>
}>()

export const useSignUpProps = (): SignupProps => {
  const headerProps = useMinimalisticHeaderProps()
  const footerProps = useFooterProps()
  const plugins = SignupPlugins.usePluginHooks()
  const loginPath = loginPageRoutePath()
  const signupProps = useMemo<SignupProps>(() => {
    const signupProps: SignupProps = {
      headerProps,
      footerProps,
      signupItems: plugins.getKeyedAddons('signupMethod'),
      loginHref: href(loginPath),
      userAgreementHref: href(USER_AGREEMENTS_PAGE_PATH),
    }
    return signupProps
  }, [headerProps, footerProps, plugins, loginPath])
  return signupProps
}
