import type { PkgIdentifier } from '@moodlenet/core'
import type { UseRegisterAddOn } from '@moodlenet/react-app/webapp'
import {
  useFooterProps,
  useMinimalisticHeaderProps,
  usePkgAddOns,
} from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import { shell } from '../../../../../shell.mjs'
import type { SignupItem, SignupProps } from './Signup.js'

export type SignupMethodItem = Omit<SignupItem, 'key'>
export type SignupMethodHookResult = void
export type SignupMethodHook = (_: {
  useSignupMethod: UseRegisterAddOn<SignupMethodItem>
}) => void | SignupMethodHookResult

const signupMethodPlugins: {
  signupMethodHook: SignupMethodHook
  pkgId: PkgIdentifier
}[] = []

export function registerSignupMethodHook(signupMethodHook: SignupMethodHook) {
  const pkgId = shell.init.getCurrentInitPkg()
  signupMethodPlugins.push({ signupMethodHook, pkgId })
}

export const useSignUpProps = (): SignupProps => {
  const headerProps = useMinimalisticHeaderProps()
  const footerProps = useFooterProps()
  const [signupMethods, getRegisterSignupHook] = usePkgAddOns<SignupMethodItem>('SignupPlugin')

  signupMethodPlugins.forEach(({ pkgId, signupMethodHook }) => {
    signupMethodHook({ useSignupMethod: getRegisterSignupHook(pkgId) })
  })
  const signupProps = useMemo<SignupProps>(() => {
    const signupItems: SignupProps['signupItems'] = signupMethods.map(
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
  }, [signupMethods, headerProps, footerProps])
  return signupProps
}
