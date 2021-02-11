import { FC } from 'react'
import { LoginPage } from '../../ui/pages/Login'
import { LoginPanelBigCtrl } from '../components/LoginPanelBigCtrl'

export const LoginPageCtrl: FC = () => {
  const LoginPanel = <LoginPanelBigCtrl />
  return <LoginPage LoginPanel={LoginPanel} />
}
