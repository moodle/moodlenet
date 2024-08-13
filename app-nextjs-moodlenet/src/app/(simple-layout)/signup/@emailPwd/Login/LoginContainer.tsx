import type { FC } from 'react'
import * as LoginAddon from './Login.jsx'
import { usePanelProps } from './LoginHooks.jsx'

export const LoginPanelContainer: FC = () => {
  const panelProps = usePanelProps()

  return <LoginAddon.LoginPanel {...panelProps} />
}
