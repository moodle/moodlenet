import { FC, useContext } from 'react'
// import { withCtrl } from '../../../../lib/ctrl'
import Card from '../../../atoms/Card/Card'
import Switch from '../../../atoms/Switch/Switch'
import { StateContext } from '../../../layout/ContextProvider'
import { packagesFake } from '../fakeData'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import './styles.scss'

export type ModulesProps = {}

const Modules: FC<ModulesProps> = () => {
  const stateContext = useContext(StateContext)

  const modulesList = packagesFake.map(p => {
    return p.modules.map(
      (module, i) =>
        (!module.mandatory || stateContext?.devMode) && (
          <div className="module" key={i}>
            {/* <PackageIcon /> */}
            <div className="name">{module.name}</div>
            <Switch enabled={module.enabled} mandatory={module.mandatory} />
          </div>
        ),
    )
  })
  return (
    <div className="modules">
      <Card>
        <div className="title">Modules</div>
        <div>Manage your modules</div>
      </Card>
      <Card className="modules-list">
        {/* <div className="title">Disabled Modules</div>
        <div>A list of your inactive Modules</div> */}
        <div className="list">{modulesList}</div>
      </Card>
    </div>
  )
}

Modules.displayName = 'Modules'
export default Modules
