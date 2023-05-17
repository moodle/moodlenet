import {
  createHookPlugin,
  useFooterProps,
  useMinimalisticHeaderProps,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type { SignupItem, SignupProps } from './Signup.js'
export type SignupMethodItem = Omit<SignupItem, 'key'>
export const SignupPlugins = createHookPlugin<{
  signupMethod: SignupMethodItem
}>({ signupMethod: null })

export const useSignUpProps = (): SignupProps => {
  const headerProps = useMinimalisticHeaderProps()
  const footerProps = useFooterProps()
  const [addons] = SignupPlugins.useHookPlugin()

  const signupProps = useMemo<SignupProps>(() => {
    const signupProps: SignupProps = {
      headerProps,
      footerProps,
      signupItems: addons.signupMethod,
    }
    return signupProps
  }, [headerProps, footerProps, addons.signupMethod])
  return signupProps
}
