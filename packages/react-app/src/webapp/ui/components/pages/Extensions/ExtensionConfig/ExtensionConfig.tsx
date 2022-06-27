import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { FC, useContext } from 'react'
// import { searchNpmExtensionConfig } from '../../../../../helpers/utilities'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
import lib from 'moodlenet-react-app-lib'
import Card from '../../../atoms/Card/Card'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import Switch from '../../../atoms/Switch/Switch'
import TertiaryButton from '../../../atoms/TertiaryButton/TertiaryButton'
import { Module, Package } from '../fakeData'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import './styles.scss'

export type ExtensionConfigProps = {
  extension: Package
  onClickBackBtn?(arg0?: unknown): unknown | any
}

const ExtensionConfig: FC<ExtensionConfigProps> = ({ extension, onClickBackBtn }) => {
  const stateContext = useContext(lib.devMode.StateContext)

  const modulesList = extension?.modules.map(
    (module: Module, i) =>
      (!module.mandatory || stateContext?.devMode) && (
        <div className="module" key={i}>
          <div className="name">{module.name}</div>
          <Switch enabled={module.enabled} mandatory={module.mandatory} />
        </div>
      ),
  )

  return (
    <div className="extension-config">
      <Card className="header-card">
        <div className="title">
          <div className="title-and-back">
            <TertiaryButton className="back" color="black" onClick={onClickBackBtn}>
              <ArrowBackIcon />
            </TertiaryButton>
            {extension.name}
          </div>
          <PrimaryButton className="install-btn" disabled={extension.mandatory} onClick={() => alert('installing')}>
            Uninstall
          </PrimaryButton>
        </div>

        <div>{extension.creator}</div>
      </Card>
      <Card className="modules">
        <div className="title">Modules</div>
        <div className="list">{modulesList}</div>
      </Card>
    </div>
  )
}
ExtensionConfig.displayName = 'ExtensionConfig'
export default ExtensionConfig
