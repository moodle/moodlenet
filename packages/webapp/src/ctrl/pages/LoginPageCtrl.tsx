import { FC } from 'react'
import { LoginPage } from '../../ui/pages/Login'
import { LoginPanelBigCtrl } from '../components/LoginPanelBigCtrl'
import { useRedirectHomeIfLoggedIn } from '../helpers/nav'

export const LoginPageCtrl: FC = () => {
  useRedirectHomeIfLoggedIn()

  const LoginPanel = <LoginPanelBigCtrl />
  return <LoginPage LoginPanel={LoginPanel} />
}
