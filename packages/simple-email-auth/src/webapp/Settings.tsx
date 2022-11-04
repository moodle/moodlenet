// import lib from 'moodlenet-react-app-lib'
import { Card } from '@moodlenet/component-library'
import './Signup.scss'

// const { InputTextField, PrimaryButton, TertiaryButton, Card } = lib.ui.components
export type SignupFormValues = { email: string; password: string; displayName: string }

export const Menu = <span>Email Auth</span>
export const Content = (
  <div className="simple-auth" key="simple-auth">
    <Card>
      <div className="title">Email Auth</div>
      <div>Manage extension preferences</div>
    </Card>
  </div>
)
