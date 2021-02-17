import { FC } from 'react'
import { ActivateNewAccountPage } from '../../ui/pages/ActivateNewAccount'
import { ActivateNewAccountPanelCtrl } from '../components/ActivateNewAccountPanel'
import { useRedirectHomeIfLoggedIn } from '../helpers/nav'

type ActivateNewAccountPageCtrlProps = {
  token: string
}
export const ActivateNewAccountPageCtrl: FC<ActivateNewAccountPageCtrlProps> = ({ token }) => {
  useRedirectHomeIfLoggedIn()
  const ActivateNewAccountPanel = <ActivateNewAccountPanelCtrl token={token} />
  return <ActivateNewAccountPage ActivateNewAccountPanel={ActivateNewAccountPanel} />
}
