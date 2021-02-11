import { FC } from 'react'
import { SignUpPage } from '../../ui/pages/SignUp'
import { SignupPanelBigCtrl } from '../components/SignupPanelBigCtrl'

export const SignupPageCtrl: FC = () => {
  const SignupPanel = <SignupPanelBigCtrl />
  return <SignUpPage SignupPanel={SignupPanel} />
}
