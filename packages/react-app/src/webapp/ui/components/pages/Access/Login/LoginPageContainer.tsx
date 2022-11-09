import { FC } from 'react'
import { LoginPage } from './Login.js'
import { useLoginProps } from './LoginPageHook.mjs'

export const LoginPanelContainer: FC = () => {
  const myProps = useLoginProps()

  return <LoginPage {...myProps} />
}

export default LoginPanelContainer
