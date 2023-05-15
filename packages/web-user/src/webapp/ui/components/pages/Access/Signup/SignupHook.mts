import {
  useFooterProps,
  useMinimalisticHeaderProps,
  usePkgAddOns,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type { SignupItem, SignupProps } from './Signup.js'

export type SignupPluginItem = Omit<SignupItem, 'key'>

export const useSignUpProps = (): SignupProps => {
  const headerProps = useMinimalisticHeaderProps()
  const footerProps = useFooterProps()
  const [signupPlugins /*,registerSignup */] = usePkgAddOns<SignupPluginItem>('SignupPlugin')

  const signupProps = useMemo<SignupProps>(() => {
    const signupItems: SignupProps['signupItems'] = signupPlugins.map(
      ({ addOn: { Icon, Panel }, key }) => ({
        Icon,
        Panel,
        key,
      }),
    )
    return {
      headerProps,
      footerProps,
      signupItems,
    }
  }, [signupPlugins, headerProps, footerProps])
  return signupProps
}
