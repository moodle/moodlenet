import type { AddOnMap } from '@moodlenet/core/lib'
import { href } from '@moodlenet/react-app/common'
import {
  createPlugin,
  useFooterProps,
  useMinimalisticHeaderProps,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import {
  LOGIN_PAGE_ROUTE_BASE_PATH,
  USER_AGREEMENTS_PAGE_PATH,
} from '../../../../common/webapp-routes.mjs'
import type { SignupItem, SignupProps } from '../../../ui/exports/ui.mjs'
export type SignupMethodItem = Omit<SignupItem, 'key'>
export const SignupPlugins = createPlugin<{
  signupMethod: AddOnMap<SignupMethodItem>
}>()

export const useSignUpProps = (): SignupProps => {
  const headerProps = useMinimalisticHeaderProps()
  const footerProps = useFooterProps()
  const plugins = SignupPlugins.usePluginHooks()

  const signupProps = useMemo<SignupProps>(() => {
    const signupProps: SignupProps = {
      headerProps,
      footerProps,
      signupItems: plugins.getKeyedAddons('signupMethod'),
      loginHref: href(LOGIN_PAGE_ROUTE_BASE_PATH),
      userAgreementHref: href(USER_AGREEMENTS_PAGE_PATH),
    }
    return signupProps
  }, [headerProps, footerProps, plugins])
  return signupProps
}
