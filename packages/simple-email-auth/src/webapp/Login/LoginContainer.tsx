import { FC } from 'react'
import * as LoginAddon from './Login.js'
import { usePanelProps } from './LoginHooks.js'

export const LoginPanelCtrl: FC = () => {
  const panelProps = usePanelProps()

  return <LoginAddon.Panel {...panelProps} />
}
