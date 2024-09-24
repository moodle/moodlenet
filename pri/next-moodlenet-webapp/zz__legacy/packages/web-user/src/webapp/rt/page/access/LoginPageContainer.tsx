import type { FC } from 'react'
import { LoginPage } from '../../../ui/exports/ui.mjs'
import { useLoginProps } from './LoginPageHook.mjs'

export const LoginPanelContainer: FC = () => {
  const myProps = useLoginProps()

  return <LoginPage {...myProps} />
}

export default LoginPanelContainer
