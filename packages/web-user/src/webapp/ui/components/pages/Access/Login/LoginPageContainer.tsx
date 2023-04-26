import { FC } from 'react'
import { LoginPage } from './Login.js'
import { useLoginProps } from './LoginPageHook.mjs'

export const LoginPanelContainer: FC = () => {
  const myProps = useLoginProps()

  //TODO //@ETTO: needs a registry in react-app : packages/react-app/src/webapp/ui/components/organisms/Header/Minimalistic/MinimalisticHeaderHooks.mts
  // const { registries } = useContext(ReactAppContext)
  // registries.miniHeaderRightComponents.useRegister({
  //   Component: () => <SignupButtonMini signupHref={href('/signup')} />,
  // })

  return <LoginPage {...myProps} />
}

export default LoginPanelContainer
