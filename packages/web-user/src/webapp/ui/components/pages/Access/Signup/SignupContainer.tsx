import type { FC } from 'react'
import { Signup } from './Signup.js'
import { useSignUpProps } from './SignupHook.mjs'

export const SignUpContainer: FC = () => {
  const myProps = useSignUpProps()

  //TODO //@ETTO: needs a registry in react-app : packages/react-app/src/webapp/ui/components/organisms/Header/Minimalistic/MinimalisticHeaderHooks.mts
  // const { registries } = useContext(ReactAppContext)
  // registries.miniHeaderRightComponents.useRegister({
  //   Component: () => <LoginButtonMini loginHref={href('/login')} />,
  // })

  return <Signup {...myProps} />
}
