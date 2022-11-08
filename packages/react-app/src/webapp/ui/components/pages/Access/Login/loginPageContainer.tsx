import { FC } from 'react'
import { LoginPage } from './Login.js'
import { useLopigPageProps } from './LoginPageHook.mjs'

export const LoginPanelContainer: FC = () => {
  const myProps = useLopigPageProps()

  return <LoginPage {...myProps} />
}

export default LoginPanelContainer
