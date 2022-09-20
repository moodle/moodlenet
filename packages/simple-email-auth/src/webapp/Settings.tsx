// import lib from 'moodlenet-react-app-lib'
import { FC, useContext } from 'react'
import { MainContext } from './MainModule'
import './Signup.scss'

// const { InputTextField, PrimaryButton, TertiaryButton, Card } = lib.ui.components
export type SignupFormValues = { email: string; password: string; displayName: string }

export const Menu: FC = () => <span>Email Auth</span>
export const Content: FC = () => {
  const { shell } = useContext(MainContext)
  const [, reactApp] = shell.deps
  const { Card } = reactApp.ui.components

  return (
    <Card>
      <div className="title">Email Auth</div>
      <div>Manage extension preferences</div>
    </Card>
  )
}
