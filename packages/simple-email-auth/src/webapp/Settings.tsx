// import lib from 'moodlenet-react-app-lib'
import { FC } from 'react'
import './Signup.scss'

// const { InputTextField, PrimaryButton, TertiaryButton, Card } = lib.ui.components.atoms
export type SignupFormValues = { email: string; password: string; displayName: string }

export const Menu: FC = () => <span>Email Auth</span>
export const Content: FC = () => {
  return <h1>email settings</h1>
}
