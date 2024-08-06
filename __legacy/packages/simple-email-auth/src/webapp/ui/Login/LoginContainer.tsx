import type { FC } from 'react'
import * as LoginAddon from './Login.js'
import { usePanelProps } from './LoginHooks.js'

export const LoginPanelContainer: FC = () => {
  const panelProps = usePanelProps()

  return <LoginAddon.LoginPanel {...panelProps} />
}
