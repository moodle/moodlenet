import { FC } from 'react'
// import { withCtrl } from '../../../../lib/ctrl'
import Card from '../../../atoms/Card/Card'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import './styles.scss'

export type ModulesProps = {}

const Modules: FC<ModulesProps> = () => {
  return (
    <div className="modules">
      <Card>
        <div className="title">Modules</div>
        <div>Manage your modules</div>
      </Card>
      <Card>
        {/* <div className="title">Disabled Modules</div>
        <div>A list of your inactive Modules</div> */}
      </Card>
    </div>
  )
}

Modules.displayName = 'Modules'
export default Modules
