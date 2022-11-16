// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import {
  AddonItem,
  Card,
  InputTextField,
  Loading,
  PrimaryButton,
  Switch,
} from '@moodlenet/component-library'
import { HeaderRightComponentRegItem } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import { FC, useContext, useState } from 'react'
// import { ReactComponent as PackageIcon } from '../../../../assets/icons/package.svg'
// import { withCtrl } from '../../../../lib/ctrl'
import ExtensionInfo from '../ExtensionInfo/ExtensionInfo.js'
// import { DevModeBtn } from '../Extensions.js'
import { MainContext } from '../../../MainContext.js'
// import InputTextField from '../../../atoms/InputTextField/InputTextField'
import ExtensionsList from '../../organisms/ExtensionsList/ExtensionsList.js'
import './InstallExtension.scss'

export type ExtensionType = {
  name: string
  displayName: string
  description: string
  icon?: string
  readme: string
  mandatory?: boolean
  installed: boolean
  repositoryUrl: string
  isInstallingUninstalling: boolean
  config?: AddonItem
  toggleInstallingUninstalling: () => void
}

export type InstallExtensionFormValues = {
  localPath: string
}

const DevModeBtn: FC = () => {
  const { devMode, setDevMode } = useContext(MainContext)

  return (
    <div className="dev-mode">
      <span className="label">Developer mode</span>
      <Switch enabled={!!devMode} size="medium" onClick={() => setDevMode(p => !p)} />
    </div>
  )
}
const DevModeBtnAddon: HeaderRightComponentRegItem = { Component: DevModeBtn }

export const InstallExtensionMenu: AddonItem = {
  Item: () => <span>Install extension</span>,
  key: 'menu-install-extensions',
}

export type InstallExtensionProps = {
  form: ReturnType<typeof useFormik<InstallExtensionFormValues>>
  devMode: boolean
  extensions: ExtensionType[]
  isInstalling: boolean
  setIsInstalling: () => void
  // setDevMode: React.Dispatch<React.SetStateAction<boolean>>
  // selectedExtConfig: DeployedPkgInfo | null
  // setSelectedExtConfig: React.Dispatch<React.SetStateAction<DeployedPkgInfo | null>>
  // setSelectedExt: React.Dispatch<React.SetStateAction<ExtensionType | undefined>>
  // searchPkgResp: SearchPackagesResponse | undefined
  // setSearchPkgResp: React.Dispatch<React.SetStateAction<SearchPackagesResponse | undefined>>
  // menuItemPressed: boolean
}

const InstallExtension: FC<InstallExtensionProps> = ({
  form,
  devMode,
  extensions,
  isInstalling,
  setIsInstalling,
  // setSelectedExt,
}) => {
  const [selectedExt, setSelectedExt] = useState<ExtensionType | undefined>()
  const shouldShowErrors = !!form.submitCount
  const canSubmit = form.dirty && form.isValid && !form.isSubmitting && !form.isValidating

  const installExtension = !selectedExt && (
    <div className="install-extension">
      <Card className="title">
        <div className="title">Install extension</div>
      </Card>
      {devMode && (
        <Card>
          <div className="subtitle">From local package</div>
          <div className="option">
            <div className="name">Local path</div>
            <div className="actions">
              <>
                <InputTextField
                  className="local-path"
                  placeholder="Local path to package"
                  disabled={canSubmit}
                  value={form.values.localPath}
                  onChange={form.handleChange}
                  name="package-name"
                  error={shouldShowErrors && form.errors.localPath}
                />
                <PrimaryButton
                  className={`${isInstalling ? 'loading' : ''}`}
                  // disabled={localPathField === ''}
                  noHover={isInstalling}
                  onClick={setIsInstalling}
                >
                  <div
                    className="loading"
                    style={{ visibility: isInstalling ? 'visible' : 'hidden' }}
                  >
                    <Loading color="white" />
                  </div>
                  <div
                    className="label"
                    style={{ visibility: isInstalling ? 'hidden' : 'visible' }}
                    onClick={form.submitForm}
                  >
                    Install
                  </div>
                </PrimaryButton>
              </>
            </div>
          </div>
        </Card>
      )}
      <ExtensionsList
        extensions={extensions}
        setSelectedExt={setSelectedExt}
        title="Compatible extensions"
      />
    </div>
  )

  return (
    <>
      {installExtension}
      {selectedExt && (
        <ExtensionInfo extension={selectedExt} onClickBackBtn={() => setSelectedExt(undefined)} />
      )}
      {/* {isInstalling && (
        <div style={{ position: 'fixed', top: '0', bottom: '0', left: '0', right: '0', background: 'rgba(0,0,0,0.6)' }}>
          <h1 style={{ textAlign: 'center', color: 'white' }}>Spinner !</h1>
        </div>
      )} */}
    </>
  )
}
InstallExtension.displayName = 'InstallExtension'
export default InstallExtension
