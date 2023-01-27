// import lib from 'moodlenet-react-app-lib'
import { Card } from '@moodlenet/component-library'
import { FC } from 'react'
import './Signup.scss'

// const { InputTextField, PrimaryButton, TertiaryButton, Card } = lib.ui.components
export type SignupFormValues = { email: string; password: string; title: string }

export const Menu: FC = () => <span>Email Auth</span>

export const Content: FC = () => (
  <div className="simple-auth" key="simple-auth">
    <Card className="column">
      <div className="title">Email Auth</div>
      <div>Manage extension preferences</div>
    </Card>
  </div>
)
