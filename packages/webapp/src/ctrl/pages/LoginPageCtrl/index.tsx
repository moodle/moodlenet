import { FC } from 'react'
import { LoginPage } from '../../../ui/pages/Login'
import { LoginPanelBigCtrl } from '../../components/LoginPanelBigCtrl'
import { SignupPanelBigCtrl } from '../../components/SignupPanelBigCtrl'

export const LoginPageCtrl: FC = () => {
  const LoginPanel = <LoginPanelBigCtrl />
  const SignupPanel = <SignupPanelBigCtrl />
  return <LoginPage SignupPanel={SignupPanel} LoginPanel={LoginPanel} />
}
