import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { FC, useCallback, useReducer } from 'react'
// import { searchNpmExtensionConfig } from '../../../../../helpers/utilities'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
import lib from 'moodlenet-react-app-lib'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
// import { StateContext } from '../ExtensionsProvider'
import { CoreExt, ExtInfo } from '@moodlenet/core'
import './styles.scss'

export type ExtensionConfigProps = {
  extInfo: ExtInfo
  onClickBackBtn?(arg0?: unknown): unknown | any
}

const PrimaryButton = lib.ui.components.atoms.PrimaryButton
// const Switch = lib.ui.components.atoms.Switch
const Card = lib.ui.components.atoms.Card
const TertiaryButton = lib.ui.components.atoms.TertiaryButton

const ExtensionConfig: FC<ExtensionConfigProps> = ({ extInfo, onClickBackBtn }) => {
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
  const [isInstalling, toggleIsInstalling] = useReducer((p: boolean) => !p, false)
  const uninstall = useCallback(() => {
    toggleIsInstalling()
    lib.priHttp
      .fetch<CoreExt>(
        'moodlenet-core',
        '0.1.10',
      )('pkg/uninstall')({
        installationFolder: extInfo.packageInfo.installationFolder,
      })
      .finally(toggleIsInstalling)
  }, [extInfo.packageInfo.installationFolder])
  return (
    <>
      <div className="extension-config">
        <Card className="header-card">
          <div className="title">
            <div className="title-and-back">
              <TertiaryButton className="back" color="black" onClick={onClickBackBtn}>
                <ArrowBackIcon />
              </TertiaryButton>
              {extInfo.ext.displayName}
            </div>
            <PrimaryButton className="install-btn" disabled={false /* extension.mandatory */} onClick={uninstall}>
              Uninstall
            </PrimaryButton>
          </div>

          <div>{extInfo.ext.description}</div>
        </Card>
        {modulesList && (
          <Card className="modules">
            <div className="title">Modules</div>
            <div className="list">{modulesList}</div>
          </Card>
        )}
      </div>
      {isInstalling && (
        <div style={{ position: 'fixed', top: '0', bottom: '0', left: '0', right: '0', background: 'rgba(0,0,0,0.6)' }}>
          <h1 style={{ textAlign: 'center', color: 'white' }}>Spinner !</h1>
        </div>
      )}
    </>
  )
}
ExtensionConfig.displayName = 'ExtensionConfig'
export default ExtensionConfig
