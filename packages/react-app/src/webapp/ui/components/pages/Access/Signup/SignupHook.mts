import { useMemo } from 'react'
import { signupItems as signupItemsReg } from '../../../../../registries.mjs'
import { useMinimalisticHeaderProps } from '../../../organisms/Header/Minimalistic/MinimalisticHeaderHooks.mjs'
import { SignupProps } from './Signup.js'

export const useSignUpProps = (): SignupProps => {
  const headerProps = useMinimalisticHeaderProps()
  const { registry } = signupItemsReg.useRegistry()
  const signupProps = useMemo<SignupProps>(() => {
    const signupItems = registry.entries.map(el => el.item)
    return {
      headerProps,
      signupItems,
    }
  }, [headerProps, registry.entries])
  return signupProps
}
