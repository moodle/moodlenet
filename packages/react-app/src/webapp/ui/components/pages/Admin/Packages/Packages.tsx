import { FC } from 'react'
// import { withCtrl } from '../../../../lib/ctrl'
import Card from '../../../atoms/Card/Card'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import './styles.scss'

export type PackagesProps = {}

const Packages: FC<PackagesProps> = () => {
  return (
    <div className="packages">
      <Card>
        <h1>Packages</h1>
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

Packages.displayName = 'Packages'
export default Packages
