import { FC } from 'react'
import { ActivateNewAccountPage } from '../../../ui/pages/ActivateNewAccount'
import { ActivateNewAccountPanelCtrl } from '../../components/ActivateNewAccountPanel'

type ActivateNewAccountPageCtrlProps = {
  token: string
}
export const ActivateNewAccountPageCtrl: FC<ActivateNewAccountPageCtrlProps> = ({ token }) => {
  const ActivateNewAccountPanel = <ActivateNewAccountPanelCtrl token={token} />
  return <ActivateNewAccountPage ActivateNewAccountPanel={ActivateNewAccountPanel} />
}
