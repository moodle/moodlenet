// import lib from 'moodlenet-react-app-lib'
import { AddonItem, Card } from '@moodlenet/component-library'
import './Signup.scss'

// const { InputTextField, PrimaryButton, TertiaryButton, Card } = lib.ui.components
export type SignupFormValues = { email: string; password: string; displayName: string }

export const Menu: AddonItem = {
  Item: () => <span>Email Auth</span>,
  key: 'menu-single-email-auth',
}
export const Content: AddonItem = {
  Item: () => (
    <div className="simple-auth" key="simple-auth">
      <Card className="column">
        <div className="title">Email Auth</div>
        <div>Manage extension preferences</div>
      </Card>
    </div>
  ),
  key: 'content-single-email-auth',
}
