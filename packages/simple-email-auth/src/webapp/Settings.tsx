// import lib from 'moodlenet-react-app-lib'
import lib from 'moodlenet-react-app-lib'
import { FC } from 'react'
import './Signup.scss'

const { Card } = lib.ui.components.atoms

// const { InputTextField, PrimaryButton, TertiaryButton, Card } = lib.ui.components.atoms
export type SignupFormValues = { email: string; password: string; displayName: string }

export const Menu: FC = () => <span>Email Authentication</span>
export const Content: FC = () => {
  return (
    <Card>
      <h1>Email settings</h1>
    </Card>
  )
}
