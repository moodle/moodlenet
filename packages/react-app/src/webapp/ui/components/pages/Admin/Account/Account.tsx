import { FC } from 'react'
import Card from '../../../atoms/Card/Card'
import './styles.scss'

export type AccountProps = {}

const Account: FC<AccountProps> = () => {
  return (
    <div className="account">
      <Card>
        <h1>Account</h1>
        <div>Manage your access settings</div>
      </Card>
      <Card>
        <h2>Email</h2>
        <div>{/* <InputTextField edit={true} placeholder="username@email.com" /> */}</div>
      </Card>
      <Card>
        <h2>Password</h2>
        <div>{/* <InputTextField edit={true} placeholder="*********************" /> */}</div>
      </Card>
    </div>
  )
}

Account.displayName = 'Account'
export default Account
