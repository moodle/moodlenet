import { Trans } from '@lingui/macro'
import { withCtrl } from '../../../../lib/ctrl'
import Card from '../../../atoms/Card/Card'
import InputTextField from '../../../atoms/InputTextField/InputTextField'
import './styles.scss'

export type AccountProps = {}

const Account = withCtrl<AccountProps>(() => {
  return (
    <div className="account">
      <Card>
        <h1>
          <Trans>Account</Trans>
        </h1>
        <div>
          <Trans>Manage your access settings</Trans>
        </div>
      </Card>
      <Card>
        <h2>
          <Trans>Email</Trans>
        </h2>
        <div>
          <InputTextField edit={true} placeholder="username@email.com" />
        </div>
      </Card>
      <Card>
        <h2>
          <Trans>Password</Trans>
        </h2>
        <div>
          <InputTextField edit={true} placeholder="*********************" />
        </div>
      </Card>
    </div>
  )
})

Account.displayName = 'Account'
export default Account
