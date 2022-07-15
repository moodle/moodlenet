import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { FC } from 'react'
// import { searchNpmExtensionConfig } from '../../../../../helpers/utilities'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
import lib from 'moodlenet-react-app-lib'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
// import { StateContext } from '../ExtensionsProvider'
import { ExtInfo } from '@moodlenet/core'
import './styles.scss'

export type ExtensionConfigProps = {
  extension: ExtInfo
  onClickBackBtn?(arg0?: unknown): unknown | any
}

const PrimaryButton = lib.ui.components.atoms.PrimaryButton
// const Switch = lib.ui.components.atoms.Switch
const Card = lib.ui.components.atoms.Card
const TertiaryButton = lib.ui.components.atoms.TertiaryButton

const ExtensionConfig: FC<ExtensionConfigProps> = ({ extension, onClickBackBtn }) => {
  // const stateContext = useContext(StateContext)

  const modulesList = null /* extension?.modules.map(
    (module: Module, i) =>
      (!module.mandatory || stateContext.devMode) && (
        <div className="module" key={i}>
          <div className="name">{module.name}</div>
          <Switch enabled={module.enabled} mandatory={module.mandatory} />
        </div>
      ),
  ) */

  return (
    <div className="extension-config">
      <Card className="header-card">
        <div className="title">
          <div className="title-and-back">
            <TertiaryButton className="back" color="black" onClick={onClickBackBtn}>
              <ArrowBackIcon />
            </TertiaryButton>
            {extension.ext.displayName}
          </div>
          <PrimaryButton
            className="install-btn"
            disabled={false /* extension.mandatory */}
            onClick={() => alert('installing')}
          >
            Uninstall
          </PrimaryButton>
        </div>

        <div>{extension.ext.description}</div>
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
