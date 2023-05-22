import type { FC } from 'react'
import { RootLogin } from '../../../ui/exports/ui.mjs'
import { useRootLoginProps } from './RootLoginHook.mjs'

export const RootLoginContainer: FC = () => {
  const myProps = useRootLoginProps()

  //TODO //@ETTO: needs a registry in react-app : packages/react-app/src/webapp/ui/components/organisms/Header/Minimalistic/MinimalisticHeaderHooks.mts
  // const { registries } = useContext(ReactAppContext)
  // registries.miniHeaderRightComponents.useRegister({
  //   Component: () => <LoginButtonMini loginHref={href('/login')} />,
  // })

  return <RootLogin {...myProps} />
}
