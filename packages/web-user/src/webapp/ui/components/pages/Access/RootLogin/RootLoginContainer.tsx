import { FC } from 'react'
import { RootLogin } from './RootLogin.js'
import { useRootLoginProps } from './RootLoginHook.mjs'

export const RootLoginContainer: FC = () => {
  const myProps = useRootLoginProps()

  //TODO //@ETTO: needs a registry in react-app : packages/react-app/src/webapp/ui/components/organisms/Header/Minimalistic/MinimalisticHeaderHooks.mts
  // const { registries } = useContext(ReactAppContext)
  // registries.miniRightComponents.useRegister({
  //   Component: () => <LoginButtonMini loginHref={href('/login')} />,
  // })

  return <RootLogin {...myProps} />
}
