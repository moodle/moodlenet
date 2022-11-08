import { signupItems as signupItemsReg } from '../../../../../registries.mjs'
import { useMinimalisticHeaderProps } from '../../../layout/Headers/HeaderHooks.mjs'
import { SignupProps } from './Signup.js'

export const useSignUpProps = (): SignupProps => {
  const headerProps = useMinimalisticHeaderProps()
  const { registry } = signupItemsReg.useRegistry()
  const signupItems = registry.entries.map(el => el.item)

  return { signupItems, headerProps }
}
