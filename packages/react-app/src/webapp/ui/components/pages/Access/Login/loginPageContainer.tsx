import { FC } from 'react'
import { LoginPage } from './Login.js'
import { useLopigPageProps } from './LoginPageHook.mjs'

export const LoginPanelContent: FC = () => {
  const myProps = useLopigPageProps()

  return <LoginPage {...myProps} />
}

export default LoginPanelContent
