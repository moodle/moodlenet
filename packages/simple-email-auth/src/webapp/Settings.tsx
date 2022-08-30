// import lib from 'moodlenet-react-app-lib'
import lib from 'moodlenet-react-app-lib'
import { FC } from 'react'
import './Signup.scss'

const { Card } = lib.ui.components

// const { InputTextField, PrimaryButton, TertiaryButton, Card } = lib.ui.components
export type SignupFormValues = { email: string; password: string; displayName: string }

export const Menu: FC = () => <span>Email Auth</span>
export const Content: FC = () => {
  return (
    <Card>
      <div className="title">Email Auth</div>
      <div>Manage extension preferences</div>
    </Card>
  )
}
