import { FC } from 'react'
// import { withCtrl } from '../../../../lib/ctrl'
import Card from '../../../atoms/Card/Card'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import './styles.scss'

export type ExtensionsProps = {}

const Extensions: FC<ExtensionsProps> = () => {
  return (
    <div className="extensions">
      <Card>
        <div className="title">Extensions</div>
        <div>Manage your extensions</div>
      </Card>
      <Card>
        {/* <div className="title">Disabled Extensions</div>
        <div>A list of your inactive extensions</div> */}
      </Card>
    </div>
  )
}

Extensions.displayName = 'Extensions'
export default Extensions
