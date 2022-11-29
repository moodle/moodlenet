import { useMemo } from 'react'
import { signupItems as signupItemsRegistry } from '../../../../../registries.mjs'
import { useMinimalisticHeaderProps } from '../../../organisms/Header/Minimalistic/MinimalisticHeaderHooks.mjs'
import { SignupProps } from './Signup.js'

export const useSignUpProps = (): SignupProps => {
  const headerProps = useMinimalisticHeaderProps()
  const { registry } = signupItemsRegistry.useRegistry()
  const signupProps = useMemo<SignupProps>(() => {
    const signupItems = registry.entries.map(el => ({ ...el.item, key: el.pkgId.name }))
    return {
      headerProps,
      signupItems,
    }
  }, [headerProps, registry.entries])
  return signupProps
}
