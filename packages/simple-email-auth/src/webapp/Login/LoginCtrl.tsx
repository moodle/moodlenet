import { FC } from 'react'
import * as LoginAddon from './LoginComponent.js'
import { usePanelProps } from './useLoginProps.js'

export const LoginPanelCtrl: FC = () => {
  const panelProps = usePanelProps()

  return <LoginAddon.Panel {...panelProps} />
}
